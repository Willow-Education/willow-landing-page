import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Social share images (Open Graph / Twitter) shown when a page link is posted
// to LinkedIn, Slack, iMessage, etc.
//
// Slack and others often show only a small square thumbnail cropped from the
// center of the image, so everything important sits in the center 630×630.

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const MINT = "#ACF7B2";
const DARK_GREEN = "#062F29";

const ASSETS_DIR = join(process.cwd(), "lib/og");

async function loadAssets() {
  const [mark, poppinsMedium] = await Promise.all([
    readFile(join(ASSETS_DIR, "willow-mark.svg"), "utf8"),
    readFile(join(ASSETS_DIR, "Poppins-Medium.ttf")),
  ]);
  return {
    markSrc: `data:image/svg+xml;base64,${Buffer.from(mark).toString("base64")}`,
    fonts: [{ name: "Poppins", data: poppinsMedium, weight: 500 as const, style: "normal" as const }],
  };
}

// Reads a JPEG from /public (e.g. "/personality-type-images/X.jpg") as a data URI.
export async function loadPublicJpeg(publicPath: string): Promise<string> {
  const data = await readFile(join(process.cwd(), "public", publicPath));
  return `data:image/jpeg;base64,${data.toString("base64")}`;
}

// The Willow logo centered on brand mint. With `image`, that picture is
// centered instead, with a small logo beneath it.
export async function renderShareImage({ image }: { image?: string } = {}) {
  const { markSrc, fonts } = await loadAssets();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: MINT,
          fontFamily: "Poppins",
          color: DARK_GREEN,
        }}
      >
        {image ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              width={440}
              height={440}
              alt=""
              style={{ borderRadius: 32, objectFit: "cover" }}
            />
            <div style={{ display: "flex", alignItems: "center", marginTop: 28 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={markSrc} width={64} height={64} alt="" />
              <div style={{ display: "flex", fontSize: 36, fontWeight: 500, marginLeft: 8 }}>
                Willow Education
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={markSrc} width={300} height={300} alt="" />
            <div style={{ display: "flex", fontSize: 60, fontWeight: 500, marginTop: 8 }}>
              Willow Education
            </div>
          </div>
        )}
      </div>
    ),
    { ...OG_IMAGE_SIZE, fonts }
  );
}
