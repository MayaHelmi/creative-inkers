#!/bin/bash
# Rebuild every generated page. checkout.html is standalone — edit it directly.
cd "$(dirname "$0")/.." || exit 1
source _build/partials.sh

emit_page "Creative Inkers — 300 DPI sublimation designs, licensed to sell" \
  "Transparent PNG sublimation designs at 300 DPI, sized for adult front prints, with a commercial licence that lets you sell every garment you make." \
  "none" _build/body-index.html index.html "$(cat _build/head-index.html)"

emit_page "Quilting &amp; Sewing — Creative Inkers" \
  "38 quilting and sewing sublimation designs. 300 DPI transparent PNGs licensed for resale of the finished item." \
  "designs" _build/body-category.html category.html "$(cat _build/head-category.html)"

emit_page "Every Thread Is a Prayer — Creative Inkers" \
  "300 DPI transparent PNG sublimation design, 4500x5400 px, commercial licence included. Instant download." \
  "designs" _build/body-product.html product.html "$(cat _build/head-product.html)"

emit_page "Bundles &amp; Membership — Creative Inkers" \
  "Themed vaults of 24-48 sublimation designs at one price, and All-Access membership: every design, new drops weekly, keep everything you download." \
  "bundles" _build/body-bundles.html bundles.html "$(cat _build/head-bundles.html)"

emit_page "Your files are ready — Creative Inkers" \
  "Order complete. Download your files now; they stay in your library forever." \
  "none" _build/body-complete.html order-complete.html "$(cat _build/head-complete.html)"

emit_page "My library — Creative Inkers" \
  "Every design you own, re-downloadable forever, with your licence attached." \
  "none" _build/body-library.html library.html "$(cat _build/head-library.html)"

emit_page "Licence — Creative Inkers" \
  "Plain-English licence: print and sell finished products; never resell the file. Tier table and seller FAQ." \
  "licence" _build/body-licence.html licence.html "$(cat _build/head-licence.html)"

emit_page "Search: quilt — Creative Inkers" \
  "18 designs for 'quilt'." \
  "designs" _build/body-search.html search.html "$(cat _build/head-search.html)"

emit_page "No results — Creative Inkers" \
  "Nothing matched — try a suggestion or request the design you needed." \
  "designs" _build/body-zero.html zero-results.html "$(cat _build/head-search.html)"

emit_page "Learn — Creative Inkers" \
  "Printing guides for sublimation and DTF sellers." \
  "learn" _build/body-learn.html learn.html ""
