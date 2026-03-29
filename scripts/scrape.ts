/**
 * Playwright scraper for haingoc.com.vn (WooCommerce)
 *
 * Extracts ~30 products across ~5 categories, news articles, and company logo.
 * Downloads all images locally and converts to WebP via sharp.
 * Validates all data against Zod schemas before writing output files.
 *
 * Run with: npx tsx scripts/scrape.ts
 */

import { chromium, type Page } from "playwright";
import sharp from "sharp";
import slugify from "slugify";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  ProductSchema,
  CategorySchema,
  type Product,
  type Category,
} from "../src/types/product.js";
import { NewsArticleSchema, type NewsArticle } from "../src/types/news.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, "..");
const BASE_URL = "https://haingoc.com.vn";

// Output directories
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const IMAGES_DIR = path.join(PUBLIC_DIR, "images");
const PRODUCTS_IMAGES_DIR = path.join(IMAGES_DIR, "products");
const NEWS_IMAGES_DIR = path.join(IMAGES_DIR, "news");
const DATA_DIR = path.join(ROOT_DIR, "src", "data");

function ensureDirs(): void {
  for (const dir of [DATA_DIR, PRODUCTS_IMAGES_DIR, NEWS_IMAGES_DIR]) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Generate a URL-safe Vietnamese slug
 */
function makeSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    locale: "vi",
    trim: true,
  });
}

/**
 * Ensure slug is unique within a set. If duplicate, append counter.
 */
function uniqueSlug(base: string, seen: Set<string>): string {
  let slug = base;
  let counter = 2;
  while (seen.has(slug)) {
    slug = `${base}-${counter}`;
    counter++;
  }
  seen.add(slug);
  return slug;
}

/**
 * Download an image URL, optimize with sharp, and save as WebP.
 * Returns local relative path for use in data files (e.g., /images/products/category/slug.webp)
 * Returns null if download or processing fails.
 */
async function downloadImage(
  imageUrl: string,
  destDir: string,
  filename: string,
  page: Page,
): Promise<string | null> {
  try {
    // Resolve relative URLs
    const absoluteUrl = imageUrl.startsWith("http")
      ? imageUrl
      : `${BASE_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;

    // Download image via Playwright context (uses same cookies/headers)
    const response = await page.context().request.get(absoluteUrl);
    if (!response.ok()) {
      console.warn(
        `  [WARN] Image download failed (${response.status()}): ${absoluteUrl}`,
      );
      return null;
    }

    const buffer = await response.body();

    // Optimize with sharp: max 800px wide, WebP quality 85
    const destPath = path.join(destDir, `${filename}.webp`);
    await sharp(buffer)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(destPath);

    // Return the public-relative path
    const relativePath =
      "/" + path.relative(PUBLIC_DIR, destPath).replace(/\\/g, "/");
    console.log(`  [IMAGE] Saved ${relativePath}`);
    return relativePath;
  } catch (err) {
    console.warn(
      `  [WARN] Image processing failed for ${imageUrl}:`,
      err instanceof Error ? err.message : err,
    );
    return null;
  }
}

/**
 * Download the company logo to public/logo.png
 */
async function downloadLogo(page: Page): Promise<void> {
  console.log("\n=== Downloading company logo ===");
  try {
    await page.goto(BASE_URL, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    // WooCommerce/flatsome theme logo selectors
    const logoSelectors = [
      ".logo img",
      ".brand-logo img",
      "header .logo img",
      ".header-logo img",
      'img[class*="logo"]',
      'a[class*="logo"] img',
      ".site-logo img",
      "header a img",
    ];

    let logoUrl: string | null = null;
    for (const selector of logoSelectors) {
      const logoEl = await page.$(selector);
      if (logoEl) {
        const src = await logoEl.getAttribute("src");
        if (src) {
          logoUrl = src;
          console.log(`  Found logo via selector: ${selector}`);
          break;
        }
      }
    }

    if (!logoUrl) {
      console.warn("  [WARN] Logo not found, skipping.");
      return;
    }

    const absoluteLogoUrl = logoUrl.startsWith("http")
      ? logoUrl
      : `${BASE_URL}${logoUrl.startsWith("/") ? "" : "/"}${logoUrl}`;

    const response = await page.context().request.get(absoluteLogoUrl);
    if (!response.ok()) {
      console.warn(`  [WARN] Logo download failed: ${response.status()}`);
      return;
    }

    const buffer = await response.body();
    const logoPath = path.join(PUBLIC_DIR, "logo.png");

    // Convert to PNG via sharp
    await sharp(buffer).png().toFile(logoPath);
    console.log("  [LOGO] Saved public/logo.png");
  } catch (err) {
    console.warn(
      "  [WARN] Logo download error:",
      err instanceof Error ? err.message : err,
    );
  }
}

/**
 * Known category slugs for haingoc.com.vn (WooCommerce)
 * Includes sub-categories for fuller product coverage.
 */
const KNOWN_CATEGORIES: Array<{ name: string; slug: string; url: string }> = [
  {
    name: "Que hàn",
    slug: "que-han",
    url: `${BASE_URL}/danh-muc/quehan`,
  },
  {
    name: "Máy mài",
    slug: "may-mai",
    url: `${BASE_URL}/danh-muc/may-mai/may-mai-metabo`,
  },
  {
    name: "Dụng cụ cắt hàn",
    slug: "dung-cu-cat-han",
    url: `${BASE_URL}/danh-muc/dung-cu-cat-han`,
  },
  {
    name: "Đá mài - Đá cắt",
    slug: "da-mai-da-cat",
    url: `${BASE_URL}/danh-muc/da-mai-da-cat`,
  },
  {
    name: "Vật tư thiết bị",
    slug: "vat-tu-thiet-bi",
    url: `${BASE_URL}/danh-muc/vat-tu-thiet-bi`,
  },
];

/**
 * Extract product links from a WooCommerce category page
 */
async function scrapeProductLinks(
  page: Page,
  categoryUrl: string,
): Promise<Array<{ name: string; url: string; imageUrl: string | null }>> {
  const items: Array<{ name: string; url: string; imageUrl: string | null }> =
    [];
  const seenUrls = new Set<string>();
  let currentUrl = categoryUrl;
  let pageNum = 1;

  while (true) {
    console.log(`  Loading page ${pageNum}: ${currentUrl}`);
    try {
      await page.goto(currentUrl, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
    } catch (err) {
      console.warn(
        `  [WARN] Failed to navigate:`,
        err instanceof Error ? err.message : err,
      );
      break;
    }

    // WooCommerce product card selectors
    const productCards = await page.$$(
      "li.product, .product-small, .type-product",
    );
    console.log(`  Found ${productCards.length} product cards`);

    for (const card of productCards) {
      try {
        // Get product title link
        const linkEl = await card.$(
          "a.woocommerce-loop-product__link, a[href*='chi-tiet'], h2 a, .product-title a, a.product-item-link",
        );
        const href = await linkEl?.getAttribute("href");
        if (!href || seenUrls.has(href)) continue;

        // Get product name from title element or link text
        const titleEl = await card.$(
          ".product-title, h2.woocommerce-loop-product__title, h2, .name",
        );
        const name = (await titleEl?.textContent())?.trim() ?? "";

        // Get product image (list page quality)
        const imgEl = await card.$("img");
        const imageUrl =
          (await imgEl?.getAttribute("src")) ??
          (await imgEl?.getAttribute("data-src")) ??
          (await imgEl?.getAttribute("data-lazy-src")) ??
          null;

        if (name && name.length > 2) {
          seenUrls.add(href);
          items.push({ name, url: href, imageUrl });
        }
      } catch (err) {
        console.warn(
          `  [WARN] Error parsing card:`,
          err instanceof Error ? err.message : err,
        );
      }
    }

    // Check for WooCommerce next page
    const nextPageEl = await page.$(
      "a.next.page-numbers, a[rel='next'], .next-page a",
    );
    const nextHref = await nextPageEl?.getAttribute("href");
    if (nextHref && !seenUrls.has(nextHref)) {
      currentUrl = nextHref;
      pageNum++;
      seenUrls.add(nextHref);
    } else {
      break;
    }
  }

  return items;
}

/**
 * Parse price text from WooCommerce Vietnamese format
 */
function parsePrice(priceText: string): {
  price: number | null;
  status: "in-stock" | "out-of-stock";
} {
  const lowerText = priceText.toLowerCase();

  // Contact for price indicators
  if (
    lowerText.includes("liên hệ") ||
    lowerText.includes("lien he") ||
    lowerText.includes("gọi ngay") ||
    lowerText.includes("call") ||
    lowerText.includes("contact") ||
    lowerText.includes("thương lượng") ||
    lowerText.includes("báo giá") ||
    priceText.trim() === "" ||
    priceText.trim() === "0"
  ) {
    return { price: null, status: "out-of-stock" };
  }

  // VND format: 1.500.000 ₫ or 1,500,000 or plain digits
  // Remove currency symbols and whitespace
  const cleaned = priceText.replace(/[₫đ\s]/g, "").trim();
  // Remove dots (thousands separators in VND)
  const numStr = cleaned.replace(/\./g, "").replace(/,\d*$/, "");
  const num = parseInt(numStr, 10);

  if (!isNaN(num) && num > 0) {
    return { price: num, status: "in-stock" };
  }

  return { price: null, status: "out-of-stock" };
}

/**
 * Parse specs from WooCommerce product detail tab content
 * The site stores specs as text in the product description tab.
 */
function parseSpecs(content: string): {
  material: string;
  origin: string;
  standard: string;
} {
  const specs = { material: "", origin: "", standard: "" };

  // Match material (chất liệu, vật liệu, material, tiêu chuẩn spec)
  const materialMatch = content.match(
    /(?:chất liệu|vật liệu|material|lớp vỏ)[:\s]+([^\n\r,]+)/i,
  );
  if (materialMatch?.[1]) specs.material = materialMatch[1].trim();

  // Match origin (xuất xứ, hãng sản xuất, origin)
  const originMatch = content.match(
    /(?:xuất xứ|hãng sản xuất|origin|nơi sản xuất|sản xuất tại)[:\s]+([^\n\r,]+)/i,
  );
  if (originMatch?.[1]) specs.origin = originMatch[1].trim();

  // Also check for "Xuất Xứ" near the bottom of content
  const xuatXuMatch = content.match(/Xuất\s*Xứ\s*:\s*([^\n\r]+)/i);
  if (xuatXuMatch?.[1] && !specs.origin) {
    specs.origin = xuatXuMatch[1].trim();
  }

  // Match standard (tiêu chuẩn, standard, AWS, ISO, DIN etc.)
  const stdMatch = content.match(
    /(?:tiêu chuẩn|standard|quy chuẩn|AWS|ISO|DIN)[:\s]+([^\n\r,]+)/i,
  );
  if (stdMatch?.[1]) specs.standard = stdMatch[1].trim();

  // Look for AWS standard pattern directly
  const awsMatch = content.match(
    /(?:Tiêu chuẩn|Standard)[:\s]+(AWS[^\n\r,]+)/i,
  );
  if (awsMatch?.[1] && !specs.standard) specs.standard = awsMatch[1].trim();

  return specs;
}

/**
 * Scrape product detail from WooCommerce product page
 */
interface ProductDetail {
  name: string;
  imageUrl: string | null;
  description: string;
  material: string;
  origin: string;
  standard: string;
  price: number | null;
  status: "in-stock" | "out-of-stock";
}

async function scrapeProductDetail(
  page: Page,
  url: string,
): Promise<ProductDetail | null> {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  } catch (err) {
    console.warn(
      `  [WARN] Cannot load product detail ${url}:`,
      err instanceof Error ? err.message : err,
    );
    return null;
  }

  // Product name
  const name = await page
    .$eval(
      ".product_title, h1.entry-title, h1.product-title, h1",
      (el) => el.textContent?.trim() ?? "",
    )
    .catch(() => "");

  if (!name) {
    console.warn(`  [WARN] No product name found at ${url}`);
    return null;
  }

  // Product image (highest quality from detail page)
  let imageUrl: string | null = null;
  const imgSelectors = [
    ".woocommerce-product-gallery__image img",
    ".product-image img",
    ".images img",
    ".woocommerce-main-image img",
    "figure.images img",
    ".product img",
    ".entry-summary img",
    "article img",
  ];
  for (const sel of imgSelectors) {
    const img = await page.$(sel);
    if (img) {
      const src =
        (await img.getAttribute("src")) ??
        (await img.getAttribute("data-src")) ??
        (await img.getAttribute("data-lazy-src"));
      if (
        src &&
        !src.includes("placeholder") &&
        !src.includes("woocommerce-placeholder")
      ) {
        imageUrl = src;
        break;
      }
    }
  }

  // Product description/specs (WooCommerce tab content)
  let descriptionText = "";
  const descSelectors = [
    "#tab-description .woocommerce-Tabs-panel",
    ".woocommerce-product-details__short-description",
    ".woocommerce-Tabs-panel--description",
    ".product-description",
    "#product-description",
    ".entry-content",
    ".woocommerce-tabs .panel",
    ".tab-pane",
    ".product-info",
  ];
  for (const sel of descSelectors) {
    const el = await page.$(sel);
    if (el) {
      const text = (await el.textContent())?.trim() ?? "";
      if (text.length > 10) {
        descriptionText = text.replace(/\s+/g, " ").trim();
        break;
      }
    }
  }

  // If still no description, try all paragraphs in product area
  if (!descriptionText) {
    const paras = await page.$$eval(".product p, .entry-content p", (els) =>
      els
        .map((el) => el.textContent?.trim() ?? "")
        .filter((t) => t.length > 20)
        .join(" "),
    );
    descriptionText = paras.slice(0, 500);
  }

  const specs = parseSpecs(descriptionText);

  // Price
  let price: number | null = null;
  let status: "in-stock" | "out-of-stock" = "out-of-stock";
  const priceEl = await page.$(
    ".price .woocommerce-Price-amount, .price bdi, .price span, .woocommerce-Price-amount",
  );
  if (priceEl) {
    const priceText = (await priceEl.textContent())?.trim() ?? "";
    const parsed = parsePrice(priceText);
    price = parsed.price;
    status = parsed.status;
  }

  return {
    name,
    imageUrl,
    description: descriptionText.slice(0, 500),
    material: specs.material,
    origin: specs.origin,
    standard: specs.standard,
    price,
    status,
  };
}

/**
 * Scrape all products in a category
 */
async function scrapeCategory(
  page: Page,
  categoryInfo: { name: string; slug: string; url: string },
  allProductSlugs: Set<string>,
): Promise<{ category: Category; products: Product[] }> {
  console.log(`\n--- Scraping category: ${categoryInfo.name} ---`);

  const categoryImagesDir = path.join(PRODUCTS_IMAGES_DIR, categoryInfo.slug);
  fs.mkdirSync(categoryImagesDir, { recursive: true });

  // Get product links
  const productLinks = await scrapeProductLinks(page, categoryInfo.url);
  console.log(`  Found ${productLinks.length} products`);

  const products: Product[] = [];

  for (const link of productLinks) {
    try {
      console.log(`\n  Processing: ${link.name}`);
      const slug = uniqueSlug(makeSlug(link.name), allProductSlugs);

      // Scrape detail page
      const detail = await scrapeProductDetail(page, link.url);
      if (!detail) {
        console.warn(`  [SKIP] Could not scrape details for ${link.name}`);
        continue;
      }

      // Use the name from detail page if available (more complete)
      const productName = detail.name || link.name;

      // Download image — prefer detail page image, fall back to list page image
      const rawImageUrl = detail.imageUrl ?? link.imageUrl;
      let imagePath: string | null = null;
      if (rawImageUrl) {
        imagePath = await downloadImage(
          rawImageUrl,
          categoryImagesDir,
          slug,
          page,
        );
      }

      // Use placeholder path if image download failed
      if (!imagePath) {
        imagePath = `/images/products/${categoryInfo.slug}/${slug}.webp`;
        console.warn(`  [WARN] Using placeholder path: ${imagePath}`);
      }

      const rawProduct = {
        id: slug,
        slug,
        name: productName,
        categorySlug: categoryInfo.slug,
        material: detail.material,
        origin: detail.origin,
        standard: detail.standard,
        description: detail.description || productName,
        image: imagePath,
        status: detail.status,
        price: detail.price,
      };

      const validation = ProductSchema.safeParse(rawProduct);
      if (!validation.success) {
        console.warn(`  [SKIP] Zod validation failed for "${productName}":`);
        console.warn(
          "  ",
          JSON.stringify(validation.error.flatten().fieldErrors, null, 2),
        );
        continue;
      }

      products.push(validation.data);
      console.log(`  [OK] ${slug} (${detail.status})`);
    } catch (err) {
      console.warn(
        `  [ERROR] Failed to process "${link.name}":`,
        err instanceof Error ? err.message : err,
      );
    }
  }

  const category: Category = CategorySchema.parse({
    slug: categoryInfo.slug,
    name: categoryInfo.name,
    description: "",
    productCount: products.length,
  });

  console.log(
    `\n  Category "${categoryInfo.name}": ${products.length} valid products`,
  );
  return { category, products };
}

/**
 * Scrape news articles from haingoc.com.vn
 */
async function scrapeNews(page: Page): Promise<NewsArticle[]> {
  console.log("\n=== Scraping news articles ===");

  const newsUrl = `${BASE_URL}/chuyen-muc/goc-thong-tin`;

  try {
    const response = await page.goto(newsUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    if (!response?.ok()) {
      console.log(
        `  [WARN] News page returned ${response?.status()}, skipping.`,
      );
      return [];
    }
  } catch (err) {
    console.warn(
      "  [WARN] Could not load news page:",
      err instanceof Error ? err.message : err,
    );
    return [];
  }

  // Find article links from WordPress category archive
  // Articles on haingoc.com.vn use .html extension and are linked as full page links
  const articleLinks: Array<{
    title: string;
    url: string;
    imageUrl: string | null;
  }> = [];
  const seenUrls = new Set<string>();

  // Get all links to .html articles (not product chi-tiet, not danh-muc)
  // Article titles on haingoc.com.vn are in heading elements (h2, h3) within the link's parent
  const allLinks = await page.$$eval("a[href]", (els) => {
    return (els as HTMLAnchorElement[])
      .filter(
        (el) =>
          (el.getAttribute("href") ?? "").includes("haingoc.com.vn") &&
          (el.getAttribute("href") ?? "").endsWith(".html"),
      )
      .map((el) => {
        // Try to find a heading element within the anchor or its parent for a clean title
        const heading = el.querySelector(
          "h1, h2, h3, h4",
        ) as HTMLElement | null;
        const headingTitle = heading?.textContent?.trim() ?? "";

        // If no heading found directly, look in parent
        const parent = el.parentElement;
        const parentHeading = parent?.querySelector(
          "h1, h2, h3, h4",
        ) as HTMLElement | null;
        const parentTitle = parentHeading?.textContent?.trim() ?? "";

        // Use the text content but only up to first newline (title is before preview text)
        const rawText = el.textContent?.trim() ?? "";
        const firstLine = rawText.split("\n")[0]?.trim() ?? "";
        // Clean up date patterns like "16/12/2023" at end of title
        const cleanTitle = firstLine
          .replace(/\s*\d{2}\/\d{2}\/\d{4}\s*$/, "")
          .replace(/\s*\d+\s*Th\d+\s*$/, "")
          .trim();

        const title = headingTitle || parentTitle || cleanTitle;
        const imgSrc =
          (el.querySelector("img") as HTMLImageElement | null)?.src ??
          (parent?.querySelector("img") as HTMLImageElement | null)?.src ??
          null;

        return {
          text: title,
          href: el.getAttribute("href") ?? "",
          imgSrc,
        };
      })
      .filter((l) => l.text.length > 10);
  });

  for (const link of allLinks) {
    if (!seenUrls.has(link.href)) {
      seenUrls.add(link.href);
      articleLinks.push({
        title: link.text,
        url: link.href,
        imageUrl: link.imgSrc,
      });
    }
  }

  console.log(`  Found ${articleLinks.length} article links`);

  const articles: NewsArticle[] = [];
  const seenSlugs = new Set<string>();

  for (const ref of articleLinks.slice(0, 10)) {
    try {
      console.log(`\n  Processing article: ${ref.title.slice(0, 80)}`);

      await page.goto(ref.url, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });

      // Get clean title from detail page h1 (overrides the nav link text)
      const detailTitle = await page
        .$eval(
          ".entry-title, h1.post-title, h1",
          (el) => el.textContent?.trim() ?? "",
        )
        .catch(() => "");
      const cleanTitle = detailTitle || ref.title;

      const slug = uniqueSlug(makeSlug(cleanTitle), seenSlugs);

      // Full content
      const contentEl = await page.$(
        ".entry-content, .post-content, .article-content, .single-content",
      );
      const content =
        (await contentEl?.textContent())
          ?.trim()
          .replace(/\s+/g, " ")
          .slice(0, 1000) ?? ref.title;

      // Summary from meta description
      let summary = "";
      const metaEl = await page.$("meta[name='description']");
      if (metaEl) {
        summary = (await metaEl.getAttribute("content")) ?? "";
      }
      if (!summary) {
        const firstPara = await page.$(".entry-content p, .post-content p");
        summary = ((await firstPara?.textContent())?.trim() ?? "").slice(
          0,
          300,
        );
      }

      // Published date
      let publishedAt =
        new Date().toISOString().split("T")[0] ?? new Date().toISOString();
      const timeEl = await page.$(
        "time[datetime], .published, .entry-date, .post-date",
      );
      if (timeEl) {
        const datetime = await timeEl.getAttribute("datetime");
        if (datetime) {
          publishedAt = datetime.split("T")[0] ?? datetime;
        } else {
          const dateText = (await timeEl.textContent())?.trim() ?? "";
          const dateMatch = dateText.match(
            /(\d{2}\/\d{2}\/\d{4}|\d{4}-\d{2}-\d{2})/,
          );
          if (dateMatch?.[1]) publishedAt = dateMatch[1];
        }
      }

      // Image
      let imagePath: string | undefined;
      const articleImgEl = await page.$(
        ".entry-content img, .post-thumbnail img, .featured-image img",
      );
      const articleImgUrl =
        (await articleImgEl?.getAttribute("src")) ??
        (await articleImgEl?.getAttribute("data-src")) ??
        ref.imageUrl;

      if (articleImgUrl) {
        const downloaded = await downloadImage(
          articleImgUrl,
          NEWS_IMAGES_DIR,
          slug,
          page,
        );
        if (downloaded) imagePath = downloaded;
      }

      const rawArticle = {
        id: slug,
        slug,
        title: cleanTitle,
        summary: summary || cleanTitle,
        content: content || cleanTitle,
        publishedAt,
        image: imagePath,
      };

      const validation = NewsArticleSchema.safeParse(rawArticle);
      if (!validation.success) {
        console.warn(`  [SKIP] Article validation failed:`);
        console.warn(
          "  ",
          JSON.stringify(validation.error.flatten().fieldErrors, null, 2),
        );
        continue;
      }

      articles.push(validation.data);
      console.log(`  [OK] Article: ${slug}`);
    } catch (err) {
      console.warn(
        `  [ERROR] Failed to process article:`,
        err instanceof Error ? err.message : err,
      );
    }
  }

  console.log(`\n  Total valid articles: ${articles.length}`);
  return articles;
}

/**
 * Escape strings for TypeScript output
 */
function escapeStr(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
}

function writeProductsFile(products: Product[]): void {
  const productStrings = products.map((p) => {
    const imageStr = p.image.replace(/\\/g, "/");
    return `  {
    id: "${escapeStr(p.id)}",
    slug: "${escapeStr(p.slug)}",
    name: \`${escapeStr(p.name)}\`,
    categorySlug: "${escapeStr(p.categorySlug)}",
    material: \`${escapeStr(p.material)}\`,
    origin: \`${escapeStr(p.origin)}\`,
    standard: \`${escapeStr(p.standard)}\`,
    description: \`${escapeStr(p.description)}\`,
    image: "${imageStr}",
    status: "${p.status}",
    price: ${p.price === null ? "null" : p.price},
  }`;
  });

  const content = `import { type Product } from "~/types/product";

export const products: Product[] = [
${productStrings.join(",\n")}
];
`;
  fs.writeFileSync(path.join(DATA_DIR, "products.ts"), content, "utf8");
  console.log(`\n[WRITE] src/data/products.ts (${products.length} products)`);
}

function writeCategoriesFile(categories: Category[]): void {
  const categoryStrings = categories.map((c) => {
    const imageStr = c.image ? `"${c.image.replace(/\\/g, "/")}"` : "undefined";
    return `  {
    slug: "${escapeStr(c.slug)}",
    name: \`${escapeStr(c.name)}\`,
    description: \`${escapeStr(c.description ?? "")}\`,
    image: ${imageStr},
    productCount: ${c.productCount ?? 0},
  }`;
  });

  const content = `import { type Category } from "~/types/product";

export const categories: Category[] = [
${categoryStrings.join(",\n")}
];
`;
  fs.writeFileSync(path.join(DATA_DIR, "categories.ts"), content, "utf8");
  console.log(
    `[WRITE] src/data/categories.ts (${categories.length} categories)`,
  );
}

function writeNewsFile(articles: NewsArticle[]): void {
  const articleStrings = articles.map((a) => {
    const imageStr = a.image ? `"${a.image.replace(/\\/g, "/")}"` : "undefined";
    return `  {
    id: "${escapeStr(a.id)}",
    slug: "${escapeStr(a.slug)}",
    title: \`${escapeStr(a.title)}\`,
    summary: \`${escapeStr(a.summary)}\`,
    content: \`${escapeStr(a.content)}\`,
    publishedAt: "${escapeStr(a.publishedAt)}",
    image: ${imageStr},
  }`;
  });

  const content = `import { type NewsArticle } from "~/types/news";

export const news: NewsArticle[] = [
${articleStrings.join(",\n")}
];
`;
  fs.writeFileSync(path.join(DATA_DIR, "news.ts"), content, "utf8");
  console.log(`[WRITE] src/data/news.ts (${articles.length} articles)`);
}

/**
 * Main scraper entry point
 */
async function main(): Promise<void> {
  console.log("==============================================");
  console.log("  Hai Ngoc B2B Scraper");
  console.log(`  Target: ${BASE_URL}`);
  console.log("==============================================\n");

  ensureDirs();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  try {
    // Step 1: Download logo
    await downloadLogo(page);

    // Step 2: Scrape products per category
    const allProducts: Product[] = [];
    const allCategories: Category[] = [];
    const allProductSlugs = new Set<string>();

    for (const categoryInfo of KNOWN_CATEGORIES) {
      try {
        const { category, products } = await scrapeCategory(
          page,
          categoryInfo,
          allProductSlugs,
        );
        if (products.length > 0) {
          allCategories.push(category);
          allProducts.push(...products);
        }
      } catch (err) {
        console.error(
          `[ERROR] Category "${categoryInfo.name}" failed:`,
          err instanceof Error ? err.message : err,
        );
      }
    }

    // Step 3: Scrape news
    const news = await scrapeNews(page);

    // Step 4: Write data files or fall back
    console.log("\n=== Writing data files ===");

    if (allProducts.length >= 10) {
      writeProductsFile(allProducts);
      writeCategoriesFile(allCategories);
      writeNewsFile(news);
    } else {
      console.warn(
        `[WARN] Only ${allProducts.length} products scraped — using fallback data`,
      );
      createFallbackData();
      return;
    }

    // Step 5: Summary
    console.log("\n==============================================");
    console.log("  SCRAPING COMPLETE");
    console.log("==============================================");
    console.log(`  Products:   ${allProducts.length}`);
    console.log(`  Categories: ${allCategories.length}`);
    console.log(`  Articles:   ${news.length}`);
    console.log("==============================================\n");
  } catch (err) {
    console.error(
      "\n[FATAL] Scraper crashed:",
      err instanceof Error ? err.message : err,
    );
    console.error("Creating fallback data...");
    createFallbackData();
  } finally {
    await context.close();
    await browser.close();
  }
}

/**
 * Create fallback mock data when scraping fails.
 * Based on the actual product types from haingoc.com.vn:
 * - Que hàn (welding rods)
 * - Máy mài (angle grinders)
 * - Dụng cụ cắt hàn (cutting/welding tools)
 * - Đá mài - Đá cắt (grinding/cutting discs)
 * - Vật tư thiết bị (industrial equipment/accessories)
 */
function createFallbackData(): void {
  console.log("\n=== Creating fallback mock data ===");

  const categories: Category[] = [
    {
      slug: "que-han",
      name: "Que hàn",
      description:
        "Que hàn cao cấp từ các thương hiệu hàng đầu Nhật Bản và Đức",
      productCount: 7,
    },
    {
      slug: "may-mai",
      name: "Máy mài",
      description: "Máy mài cầm tay và máy mài công nghiệp chính hãng",
      productCount: 4,
    },
    {
      slug: "dung-cu-cat-han",
      name: "Dụng cụ cắt hàn",
      description: "Béc cắt, đèn khò, đồng hồ khí và phụ kiện cắt hàn",
      productCount: 7,
    },
    {
      slug: "da-mai-da-cat",
      name: "Đá mài - Đá cắt",
      description: "Đá mài và đá cắt chuyên dụng thương hiệu Klingspor",
      productCount: 6,
    },
    {
      slug: "vat-tu-thiet-bi",
      name: "Vật tư thiết bị",
      description: "Vật tư và thiết bị công nghiệp đa dạng",
      productCount: 6,
    },
  ];

  const products: Product[] = [
    // Que hàn
    {
      id: "que-han-kobelco-lb-52-18",
      slug: "que-han-kobelco-lb-52-18",
      name: "Que hàn Kobelco LB-52-18, E7018 Thailand",
      categorySlug: "que-han",
      material: "Lớp vỏ hydro thấp",
      origin: "Thái Lan",
      standard: "AWS A5.1 E7018",
      description:
        "Que hàn Kobelco LB-52-18 là loại que hàn được bọc điện cực có thành phần hydro thấp. Kích thước: 2.6x350mm; 3.2x400mm; 4.0x450mm; 5.0x450mm. Quy cách: 5kg/gói, 20kg/thùng.",
      image: "/images/products/que-han/que-han-kobelco-lb-52-18.webp",
      status: "out-of-stock",
      price: null,
    },
    {
      id: "que-han-kobelco-lb52u",
      slug: "que-han-kobelco-lb52u",
      name: "Que hàn Kobelco LB52U, Thailand – Singapore",
      categorySlug: "que-han",
      material: "Điện cực hydro thấp",
      origin: "Thái Lan / Singapore",
      standard: "AWS A5.1 E7018",
      description:
        "Que hàn Kobelco LB52U chất lượng cao, phù hợp hàn thép carbon và thép hợp kim thấp.",
      image: "/images/products/que-han/que-han-kobelco-lb52u.webp",
      status: "out-of-stock",
      price: null,
    },
    {
      id: "que-han-kobelco-tgs308l",
      slug: "que-han-kobelco-tgs308l",
      name: "Que hàn Kobelco TGS308L – Thailand",
      categorySlug: "que-han",
      material: "Inox 308L",
      origin: "Thái Lan",
      standard: "AWS A5.4 E308L",
      description:
        "Que hàn TIG inox 308L, dùng hàn thép không gỉ 304/304L, 308/308L. Độ bền mối hàn cao.",
      image: "/images/products/que-han/que-han-kobelco-tgs308l.webp",
      status: "out-of-stock",
      price: null,
    },
    {
      id: "que-han-kobelco-tgs316l",
      slug: "que-han-kobelco-tgs316l",
      name: "Que hàn Kobelco TGS316L – Thailand",
      categorySlug: "que-han",
      material: "Inox 316L",
      origin: "Thái Lan",
      standard: "AWS A5.9 ER316L",
      description:
        "Que hàn TIG inox 316L dùng hàn thép không gỉ 316/316L, chịu ăn mòn hóa học tốt.",
      image: "/images/products/que-han/que-han-kobelco-tgs316l.webp",
      status: "out-of-stock",
      price: null,
    },
    {
      id: "que-han-kobelco-tgs51t",
      slug: "que-han-kobelco-tgs51t",
      name: "Que hàn Kobelco TGS51T, ER70S-6 – Thailand",
      categorySlug: "que-han",
      material: "Dây hàn MIG/MAG",
      origin: "Thái Lan",
      standard: "AWS A5.18 ER70S-6",
      description:
        "Dây hàn MIG/MAG TGS51T, phù hợp hàn thép carbon thấp và trung bình với CO2 hoặc hỗn hợp khí.",
      image: "/images/products/que-han/que-han-kobelco-tgs51t.webp",
      status: "out-of-stock",
      price: null,
    },
    {
      id: "que-han-kobelco-tgs309l",
      slug: "que-han-kobelco-tgs309l",
      name: "Que hàn Kobelco TGS309l, ER309l, Thailand",
      categorySlug: "que-han",
      material: "Inox 309L",
      origin: "Thái Lan",
      standard: "AWS A5.9 ER309L",
      description:
        "Que hàn TIG 309L dùng hàn nối thép carbon với inox, hoặc hàn thép không gỉ 309/309L.",
      image: "/images/products/que-han/que-han-kobelco-tgs309l.webp",
      status: "out-of-stock",
      price: null,
    },
    {
      id: "que-han-kobelco-tgs50",
      slug: "que-han-kobelco-tgs50",
      name: "Que hàn Kobelco TGS50, ER70S-G, Thailand",
      categorySlug: "que-han",
      material: "Dây hàn TIG carbon",
      origin: "Thái Lan",
      standard: "AWS A5.18 ER70S-G",
      description:
        "Dây hàn TIG carbon TGS50, dùng hàn thép kết cấu và thép chịu áp lực.",
      image: "/images/products/que-han/que-han-kobelco-tgs50.webp",
      status: "out-of-stock",
      price: null,
    },
    // Máy mài
    {
      id: "may-mai-metabo-wp13-125",
      slug: "may-mai-metabo-wp13-125",
      name: "Máy mài cầm tay WP13-125 Quick, Metabo/Germany",
      categorySlug: "may-mai",
      material: "Vỏ nhôm đúc và nhựa kỹ thuật",
      origin: "Đức",
      standard: "CE / GS",
      description:
        "Máy mài góc Metabo WP13-125 Quick công suất 1300W, đĩa 125mm, 11000rpm. Hệ thống kẹp nhanh Quick.",
      image: "/images/products/may-mai/may-mai-metabo-wp13-125.webp",
      status: "out-of-stock",
      price: null,
    },
    {
      id: "may-mai-metabo-wepba17-150",
      slug: "may-mai-metabo-wepba17-150",
      name: "Máy mài cầm tay WEPBA17-150 Metabo/Germany",
      categorySlug: "may-mai",
      material: "Vỏ nhôm đúc và nhựa kỹ thuật",
      origin: "Đức",
      standard: "CE / GS",
      description:
        "Máy mài góc Metabo WEPBA17-150 công suất 1700W, đĩa 150mm, tốc độ điều chỉnh điện tử.",
      image: "/images/products/may-mai/may-mai-metabo-wepba17-150.webp",
      status: "out-of-stock",
      price: null,
    },
    {
      id: "may-mai-metabo-we9-125",
      slug: "may-mai-metabo-we9-125",
      name: "Máy mài góc Metabo WE9-125 Quick",
      categorySlug: "may-mai",
      material: "Nhựa và kim loại",
      origin: "Đức",
      standard: "CE / GS",
      description:
        "Máy mài góc 900W, đĩa 125mm. Tay cầm chống rung, bảo vệ quá tải điện tử.",
      image: "/images/products/may-mai/may-mai-metabo-we9-125.webp",
      status: "out-of-stock",
      price: null,
    },
    {
      id: "may-mai-cong-nghiep-125mm",
      slug: "may-mai-cong-nghiep-125mm",
      name: "Máy mài công nghiệp 125mm",
      categorySlug: "may-mai",
      material: "Kim loại đúc",
      origin: "Đức",
      standard: "CE",
      description:
        "Máy mài công nghiệp 125mm phù hợp mài, cắt và đánh bóng bề mặt kim loại trong xưởng.",
      image: "/images/products/may-mai/may-mai-cong-nghiep-125mm.webp",
      status: "out-of-stock",
      price: null,
    },
    // Dụng cụ cắt hàn
    {
      id: "bec-cat-khi-oxy-propan-morris",
      slug: "bec-cat-khi-oxy-propan-morris",
      name: "Béc cắt dùng khí Oxy/Propan – Morris/Taiwan",
      categorySlug: "dung-cu-cat-han",
      material: "Đồng thau",
      origin: "Đài Loan",
      standard: "ISO 5172",
      description:
        "Béc cắt Oxy/Propan hiệu Morris, phù hợp cắt thép từ 3-300mm. Lỗ phun tiêu chuẩn.",
      image:
        "/images/products/dung-cu-cat-han/bec-cat-khi-oxy-propan-morris.webp",
      status: "out-of-stock",
      price: null,
    },
    {
      id: "bec-cat-khi-oxy-acetylen-morris",
      slug: "bec-cat-khi-oxy-acetylen-morris",
      name: "Béc cắt dùng khí Oxy/Acetylen – Morris/Taiwan",
      categorySlug: "dung-cu-cat-han",
      material: "Đồng thau",
      origin: "Đài Loan",
      standard: "ISO 5172",
      description:
        "Béc cắt Oxy/Acetylen Morris, dùng cho cắt thép carbon. Lửa cắt sắc bén, tiết kiệm khí.",
      image:
        "/images/products/dung-cu-cat-han/bec-cat-khi-oxy-acetylen-morris.webp",
      status: "out-of-stock",
      price: null,
    },
    {
      id: "den-kho-he-505-4",
      slug: "den-kho-he-505-4",
      name: "Đèn khò HE 505-4 – Heating torch",
      categorySlug: "dung-cu-cat-han",
      material: "Đồng thau và thép",
      origin: "Đài Loan",
      standard: "CE",
      description:
        "Đèn khò nung nóng HE 505-4 dùng khí gas/oxy, nung chảy và uốn nắn kim loại.",
      image: "/images/products/dung-cu-cat-han/den-kho-he-505-4.webp",
      status: "out-of-stock",
      price: null,
    },
    {
      id: "dong-ho-oxy-gas-morris-vm",
      slug: "dong-ho-oxy-gas-morris-vm",
      name: "Đồng hồ Oxy/Gas – Morris/Taiwan – VM Series",
      categorySlug: "dung-cu-cat-han",
      material: "Đồng thau",
      origin: "Đài Loan",
      standard: "ISO 7291",
      description:
        "Đồng hồ điều áp Oxy/Gas hiệu Morris dòng VM Series, 2 đồng hồ chỉ thị áp suất bình và đầu ra.",
      image: "/images/products/dung-cu-cat-han/dong-ho-oxy-gas-morris-vm.webp",
      status: "out-of-stock",
      price: null,
    },
    {
      id: "dau-bec-kho-4h-5h",
      slug: "dau-bec-kho-4h-5h",
      name: "Đầu béc khò 4H, 5H",
      categorySlug: "dung-cu-cat-han",
      material: "Đồng thau",
      origin: "Đài Loan",
      standard: "ISO",
      description:
        "Đầu béc khò 4H và 5H thay thế cho đèn khò công nghiệp, phù hợp nhiều loại đầu đốt.",
      image: "/images/products/dung-cu-cat-han/dau-bec-kho-4h-5h.webp",
      status: "out-of-stock",
      price: null,
    },
    {
      id: "dong-ho-co2-2200v",
      slug: "dong-ho-co2-2200v",
      name: "Đồng hồ CO2, 2200V",
      categorySlug: "dung-cu-cat-han",
      material: "Đồng thau và thép",
      origin: "Đài Loan",
      standard: "ISO 7291",
      description:
        "Đồng hồ điều áp CO2 2200V dùng cho máy hàn MIG/MAG, áp suất đầu ra điều chỉnh 0-30 lít/phút.",
      image: "/images/products/dung-cu-cat-han/dong-ho-co2-2200v.webp",
      status: "out-of-stock",
      price: null,
    },
    {
      id: "van-chong-chay-nguoc-morris",
      slug: "van-chong-chay-nguoc-morris",
      name: "Van chống cháy ngược Morris/Taiwan",
      categorySlug: "dung-cu-cat-han",
      material: "Đồng thau",
      origin: "Đài Loan",
      standard: "ISO 5175",
      description:
        "Van chống cháy ngược Morris dùng cho đồng hồ và đèn cắt Gas/Oxy, ngăn ngừa tai nạn cháy nổ.",
      image:
        "/images/products/dung-cu-cat-han/van-chong-chay-nguoc-morris.webp",
      status: "out-of-stock",
      price: null,
    },
    // Đá mài - Đá cắt
    {
      id: "da-cat-sat-125mm-klingspor-a24",
      slug: "da-cat-sat-125mm-klingspor-a24",
      name: "Đá cắt sắt 125mm (A 24 Extra) – Klingspor",
      categorySlug: "da-mai-da-cat",
      material: "Corundum – hạt nhôm oxit",
      origin: "Đức",
      standard: "EN 12413 / FEPA",
      description:
        "Đá cắt sắt Klingspor 125mm (A 24 Extra), dày 1mm, dùng cắt thép carbon, thép hình và ống thép.",
      image:
        "/images/products/da-mai-da-cat/da-cat-sat-125mm-klingspor-a24.webp",
      status: "out-of-stock",
      price: null,
    },
    {
      id: "da-cat-inox-125mm-klingspor-a24r",
      slug: "da-cat-inox-125mm-klingspor-a24r",
      name: "Đá cắt inox 125mm (A 24 R/36 Special) – Klingspor",
      categorySlug: "da-mai-da-cat",
      material: "Corundum đặc biệt không sắt",
      origin: "Đức",
      standard: "EN 12413 / FEPA",
      description:
        "Đá cắt inox Klingspor 125mm không chứa sắt, cắt sạch không bị oxy hóa bề mặt inox.",
      image:
        "/images/products/da-mai-da-cat/da-cat-inox-125mm-klingspor-a24r.webp",
      status: "out-of-stock",
      price: null,
    },
    {
      id: "da-mai-125mm-klingspor-a314",
      slug: "da-mai-125mm-klingspor-a314",
      name: "Đá mài 125mm (A314 Extra) – Klingspor",
      categorySlug: "da-mai-da-cat",
      material: "Corundum – nhôm oxit",
      origin: "Đức",
      standard: "EN 12413 / FEPA",
      description:
        "Đá mài Klingspor 125mm A314 Extra, dùng mài phẳng và mài góc thép carbon, thép hình.",
      image: "/images/products/da-mai-da-cat/da-mai-125mm-klingspor-a314.webp",
      status: "out-of-stock",
      price: null,
    },
    {
      id: "da-mai-150mm-klingspor-a314",
      slug: "da-mai-150mm-klingspor-a314",
      name: "Đá mài 150mm (A314 Extra) – Klingspor",
      categorySlug: "da-mai-da-cat",
      material: "Corundum – nhôm oxit",
      origin: "Đức",
      standard: "EN 12413 / FEPA",
      description:
        "Đá mài Klingspor 150mm A314 Extra, dùng cho máy mài 150mm, mài thô và bán tinh bề mặt thép.",
      image: "/images/products/da-mai-da-cat/da-mai-150mm-klingspor-a314.webp",
      status: "out-of-stock",
      price: null,
    },
    {
      id: "da-cat-inox-230mm-klingspor",
      slug: "da-cat-inox-230mm-klingspor",
      name: "Đá cắt inox 230mm – Klingspor",
      categorySlug: "da-mai-da-cat",
      material: "Corundum đặc biệt không sắt",
      origin: "Đức",
      standard: "EN 12413 / FEPA",
      description:
        "Đá cắt inox Klingspor 230mm, không gỉ, dùng cho máy mài 230mm cắt inox và thép hợp kim.",
      image: "/images/products/da-mai-da-cat/da-cat-inox-230mm-klingspor.webp",
      status: "out-of-stock",
      price: null,
    },
    {
      id: "da-mai-pha-ba-canh-115mm",
      slug: "da-mai-pha-ba-canh-115mm",
      name: "Đá mài phá ba cạnh 115mm",
      categorySlug: "da-mai-da-cat",
      material: "Corundum và vải tăng cường",
      origin: "Đức",
      standard: "EN 12413",
      description:
        "Đá mài phá ba cạnh 115mm dùng mài kim loại hình trụ và ống, hiệu quả mài cao.",
      image: "/images/products/da-mai-da-cat/da-mai-pha-ba-canh-115mm.webp",
      status: "out-of-stock",
      price: null,
    },
    // Vật tư thiết bị
    {
      id: "but-thu-nhiet-do-moi-han-tempindic",
      slug: "but-thu-nhiet-do-moi-han-tempindic",
      name: "Bút thử nhiệt độ mối hàn Tempindic/India",
      categorySlug: "vat-tu-thiet-bi",
      material: "Kim loại và hợp kim chỉ thị nhiệt",
      origin: "Ấn Độ",
      standard: "ISO 13916",
      description:
        "Bút thử nhiệt độ tiền gia nhiệt mối hàn Tempindic, khoảng đo từ 50°C đến 400°C. Kiểm tra nhiệt độ bề mặt trước khi hàn.",
      image:
        "/images/products/vat-tu-thiet-bi/but-thu-nhiet-do-moi-han-tempindic.webp",
      status: "out-of-stock",
      price: null,
    },
    {
      id: "kim-han-500amp-revolt",
      slug: "kim-han-500amp-revolt",
      name: "Kìm hàn 500A Revolt/India",
      categorySlug: "vat-tu-thiet-bi",
      material: "Đồng và nhựa cách điện",
      origin: "Ấn Độ",
      standard: "IEC 60974-11",
      description:
        "Kìm hàn 500A Revolt chịu dòng cao, tay cầm cách nhiệt tốt, kẹp que hàn chắc chắn.",
      image: "/images/products/vat-tu-thiet-bi/kim-han-500amp-revolt.webp",
      status: "out-of-stock",
      price: null,
    },
    {
      id: "day-han-tig-inox-2-4mm",
      slug: "day-han-tig-inox-2-4mm",
      name: "Dây hàn TIG inox 2.4mm – ER308L",
      categorySlug: "vat-tu-thiet-bi",
      material: "Inox 308L",
      origin: "Đài Loan",
      standard: "AWS A5.9 ER308L",
      description:
        "Dây hàn TIG inox ER308L đường kính 2.4mm, dùng hàn thép không gỉ 304/304L, cọng thẳng 1m.",
      image: "/images/products/vat-tu-thiet-bi/day-han-tig-inox-2-4mm.webp",
      status: "out-of-stock",
      price: null,
    },
    {
      id: "gang-tay-han-da-300mm",
      slug: "gang-tay-han-da-300mm",
      name: "Găng tay hàn da 300mm",
      categorySlug: "vat-tu-thiet-bi",
      material: "Da thuộc chịu nhiệt",
      origin: "Việt Nam",
      standard: "EN 12477",
      description:
        "Găng tay hàn da bò 300mm, bảo vệ bàn tay và cẳng tay khỏi tia lửa và nhiệt độ cao khi hàn.",
      image: "/images/products/vat-tu-thiet-bi/gang-tay-han-da-300mm.webp",
      status: "in-stock",
      price: 85000,
    },
    {
      id: "kinh-bao-ho-han-toi-9",
      slug: "kinh-bao-ho-han-toi-9",
      name: "Kính bảo hộ hàn tối số 9",
      categorySlug: "vat-tu-thiet-bi",
      material: "Kính lọc và khung nhựa",
      origin: "Trung Quốc",
      standard: "EN 169",
      description:
        "Kính bảo hộ hàn độ tối số 9, bảo vệ mắt khỏi tia UV/IR khi hàn hồ quang điện.",
      image: "/images/products/vat-tu-thiet-bi/kinh-bao-ho-han-toi-9.webp",
      status: "in-stock",
      price: 45000,
    },
    {
      id: "mat-na-han-tu-toi",
      slug: "mat-na-han-tu-toi",
      name: "Mặt nạ hàn tự tối",
      categorySlug: "vat-tu-thiet-bi",
      material: "ABS và kính lọc điện tử",
      origin: "Trung Quốc",
      standard: "EN 379 / ANSI Z87.1",
      description:
        "Mặt nạ hàn tự tối điều chỉnh DIN 9-13, phản ứng 1/30000 giây, thích hợp hàn MIG/MAG/TIG/Hồ quang.",
      image: "/images/products/vat-tu-thiet-bi/mat-na-han-tu-toi.webp",
      status: "in-stock",
      price: 650000,
    },
  ];

  const articles: NewsArticle[] = [
    {
      id: "chon-que-han-phu-hop-cho-ket-cau-thep",
      slug: "chon-que-han-phu-hop-cho-ket-cau-thep",
      title: "Hướng dẫn chọn que hàn phù hợp cho kết cấu thép",
      summary:
        "Việc lựa chọn đúng loại que hàn là yếu tố then chốt quyết định chất lượng mối hàn và độ bền kết cấu. Bài viết hướng dẫn các tiêu chí quan trọng khi chọn que hàn.",
      content:
        "Trong công nghiệp chế tạo và gia công cơ khí, que hàn là vật tư tiêu hao không thể thiếu. Để đảm bảo chất lượng mối hàn, cần chú ý các yếu tố: loại thép cần hàn, tiêu chuẩn cơ tính yêu cầu, điều kiện làm việc của kết cấu, và kiểu máy hàn sử dụng. Que hàn Kobelco của Nhật Bản (sản xuất tại Thái Lan) là lựa chọn hàng đầu với chứng nhận AWS và JIS.",
      publishedAt: "2024-03-10",
      image: undefined,
    },
    {
      id: "bao-duong-may-mai-goc-hieu-qua",
      slug: "bao-duong-may-mai-goc-hieu-qua",
      title: "Cách bảo dưỡng máy mài góc đúng cách để kéo dài tuổi thọ",
      summary:
        "Máy mài góc là thiết bị làm việc nặng nhọc trong xưởng cơ khí. Bảo dưỡng định kỳ giúp kéo dài tuổi thọ và đảm bảo an toàn lao động.",
      content:
        "Máy mài góc (angle grinder) là một trong những thiết bị được sử dụng phổ biến nhất trong xưởng cơ khí. Để máy hoạt động bền lâu và an toàn, cần thực hiện bảo dưỡng định kỳ: kiểm tra đĩa mài trước mỗi ca làm việc, làm sạch bụi kim loại sau khi dùng, kiểm tra nắp bảo vệ, bôi trơn ổ bi định kỳ theo hướng dẫn của nhà sản xuất.",
      publishedAt: "2024-02-15",
      image: undefined,
    },
    {
      id: "an-toan-lao-dong-khi-cat-han",
      slug: "an-toan-lao-dong-khi-cat-han",
      title: "Quy trình an toàn lao động khi cắt và hàn khí",
      summary:
        "Cắt và hàn khí là công việc có nhiều nguy cơ tai nạn nếu không tuân thủ quy trình an toàn. Bài viết tổng hợp các quy tắc bắt buộc để bảo vệ người lao động.",
      content:
        "Cắt và hàn khí sử dụng các loại khí dễ cháy như Acetylen, Propan kết hợp với Oxy tạo ra nhiệt độ ngọn lửa rất cao. Các biện pháp an toàn bắt buộc bao gồm: lắp van chống cháy ngược cho cả đường Oxy và khí cháy, kiểm tra rò rỉ bằng dung dịch xà phòng trước khi dùng, không để bình khí gần nguồn nhiệt, trang bị đầy đủ bảo hộ cá nhân (kính hàn, găng tay da, ủng bảo hộ).",
      publishedAt: "2024-01-20",
      image: undefined,
    },
  ];

  // Create placeholder image directories
  for (const cat of categories) {
    fs.mkdirSync(path.join(PRODUCTS_IMAGES_DIR, cat.slug), { recursive: true });
  }

  writeProductsFile(products);
  writeCategoriesFile(categories);
  writeNewsFile(articles);

  console.log("\n[INFO] Fallback data created successfully.");
  console.log(`  Products: ${products.length}`);
  console.log(`  Categories: ${categories.length}`);
  console.log(`  Articles: ${articles.length}`);
}

// Run main
main().catch((err: unknown) => {
  console.error("[FATAL]", err);
  process.exit(1);
});
