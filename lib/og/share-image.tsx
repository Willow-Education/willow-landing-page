import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Social share images (Open Graph / Twitter) shown when a page link is posted
// to LinkedIn, Slack, iMessage, etc. Each route renders one from an
// opengraph-image.tsx file.

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const ASSETS_DIR = join(process.cwd(), "lib/og");

async function loadAssets() {
  const [logo, poppinsMedium, poppinsRegular] = await Promise.all([
    readFile(join(ASSETS_DIR, "willow-logo.svg"), "utf8"),
    readFile(join(ASSETS_DIR, "Poppins-Medium.ttf")),
    readFile(join(ASSETS_DIR, "Poppins-Regular.ttf")),
  ]);
  return {
    logoSrc: `data:image/svg+xml;base64,${Buffer.from(logo).toString("base64")}`,
    fonts: [
      { name: "Poppins", data: poppinsMedium, weight: 500 as const, style: "normal" as const },
      { name: "Poppins", data: poppinsRegular, weight: 400 as const, style: "normal" as const },
    ],
  };
}

// Reads a JPEG from /public (e.g. "/personality-type-images/X.jpg") as a data URI.
export async function loadPublicJpeg(publicPath: string): Promise<string> {
  const data = await readFile(join(process.cwd(), "public", publicPath));
  return `data:image/jpeg;base64,${data.toString("base64")}`;
}

export async function renderShareImage({
  eyebrow,
  title,
  subtitle,
  cta,
  url,
  image,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  // Shown bottom-left, without the protocol, e.g. "willowed.org/careers".
  url: string;
  // Optional square picture shown on the right (data URI).
  image?: string;
}) {
  const { logoSrc, fonts } = await loadAssets();
  const titleSize = image
    ? 60
    : title.length <= 18
      ? 84
      : title.length <= 30
        ? 68
        : 58;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#F8FAFC",
          fontFamily: "Poppins",
          position: "relative",
        }}
      >
        {/* Brand accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 16,
            backgroundColor: "#ACF7B2",
          }}
        />

        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            width={380}
            height={380}
            alt=""
            style={{
              position: "absolute",
              right: 80,
              top: 72,
              borderRadius: 24,
              objectFit: "cover",
            }}
          />
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={232} height={64} alt="" />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: image ? 600 : 1040,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 500,
              color: "#0278A2",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: titleSize,
              fontWeight: 500,
              color: "#041D1A",
              lineHeight: 1.1,
              letterSpacing: -1,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              fontWeight: 400,
              color: "#535862",
              marginTop: 24,
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#535862",
          }}
        >
          <div style={{ display: "flex" }}>{url}</div>
          <div
            style={{
              display: "flex",
              backgroundColor: "#062F29",
              color: "#FFFFFF",
              fontWeight: 500,
              padding: "14px 28px",
              borderRadius: 10,
            }}
          >
            {`${cta} →`}
          </div>
        </div>
      </div>
    ),
    { ...OG_IMAGE_SIZE, fonts }
  );
}
