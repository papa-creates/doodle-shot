import { a0 as head, a1 as ensure_array_like, a2 as attr_class, e as escape_html, a3 as attr, $ as derived } from "../../chunks/renderer.js";
import "jszip";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const SIZES = [
      { name: 'iPhone 6.7"', width: 1290, height: 2796 },
      { name: 'iPhone 6.5"', width: 1284, height: 2778 },
      { name: 'iPhone 5.5"', width: 1242, height: 2208 },
      { name: 'iPad Pro 12.9"', width: 2048, height: 2732 },
      { name: 'iPad Pro 11"', width: 1668, height: 2388 },
      { name: "Android Phone", width: 1080, height: 1920 },
      { name: "Android Tablet", width: 1640, height: 2360 }
    ];
    let configs = [];
    let activeConfigId = "";
    let selectedSizeIndex = 0;
    let dragOverIndex = null;
    const activeConfig = derived(() => configs.find((c) => c.id === activeConfigId) ?? configs[0]);
    const selectedSize = derived(() => SIZES[selectedSizeIndex]);
    head("1uha8ag", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Doodle Shot — App Store screenshots for Doodle Mashups</title>`);
      });
    });
    $$renderer2.push(`<main class="app svelte-1uha8ag"><header class="app-header svelte-1uha8ag"><h1 class="logo svelte-1uha8ag">Doodle Shot</h1> <p class="tagline svelte-1uha8ag">App Store screenshots for Doodle Mashups. No login. No paywall. Entirely offline.</p></header> <section class="workspace svelte-1uha8ag"><div class="preview-col svelte-1uha8ag"><div class="size-bar svelte-1uha8ag"><!--[-->`);
    const each_array = ensure_array_like(SIZES);
    for (let idx = 0, $$length = each_array.length; idx < $$length; idx++) {
      let size = each_array[idx];
      $$renderer2.push(`<button${attr_class("size-chip svelte-1uha8ag", void 0, { "active": selectedSizeIndex === idx })} type="button">${escape_html(size.name)}</button>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    if (activeConfig()) {
      $$renderer2.push("<!--[0-->");
      const cfg = activeConfig();
      const cfgIndex = configs.findIndex((c) => c.id === cfg.id);
      $$renderer2.push(`<div${attr_class("dropzone svelte-1uha8ag", void 0, { "active": dragOverIndex === cfgIndex })} role="button" tabindex="0">`);
      if (cfg.img) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<canvas class="preview-canvas svelte-1uha8ag"></canvas>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="empty svelte-1uha8ag"><div class="empty-icon svelte-1uha8ag">📱</div> <p class="empty-title svelte-1uha8ag">Drop screenshot here</p> <p class="empty-hint svelte-1uha8ag">or click to browse</p></div>`);
      }
      $$renderer2.push(`<!--]--> <input${attr("id", `file-${cfg.id}`)} type="file" accept="image/*" class="file-input svelte-1uha8ag"/></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="preview-actions svelte-1uha8ag"><button class="btn-primary svelte-1uha8ag"${attr("disabled", !activeConfig()?.img, true)}>Download ${escape_html(selectedSize().name)}</button> <button class="btn-secondary svelte-1uha8ag"${attr("disabled", !configs.some((c) => c.img), true)}>${escape_html(`Export all configs · ${selectedSize().name}`)}</button> <button class="btn-secondary svelte-1uha8ag"${attr("disabled", !configs.some((c) => c.img), true)}>${escape_html("Export all configs · all sizes")}</button></div></div> <div class="controls-col svelte-1uha8ag"><div class="panel svelte-1uha8ag"><div class="panel-header svelte-1uha8ag"><h2 class="panel-title svelte-1uha8ag">Screenshots (${escape_html(configs.length)})</h2> <div class="panel-actions svelte-1uha8ag"><button class="icon-btn svelte-1uha8ag" title="Add" type="button">＋</button> <button class="icon-btn svelte-1uha8ag" title="Duplicate" type="button">⧉</button></div></div> <div class="config-list svelte-1uha8ag"><!--[-->`);
    const each_array_1 = ensure_array_like(configs);
    for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
      let c = each_array_1[i];
      $$renderer2.push(`<div${attr_class("config-row svelte-1uha8ag", void 0, { "active": activeConfigId === c.id })}><button class="config-name svelte-1uha8ag" type="button"><span class="config-badge svelte-1uha8ag">${escape_html(i + 1)}</span> <input type="text"${attr("value", c.name)} class="config-input svelte-1uha8ag"/></button> `);
      if (configs.length > 1) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button class="icon-btn small svelte-1uha8ag" title="Remove" type="button">×</button>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> `);
    if (activeConfig()) {
      $$renderer2.push("<!--[0-->");
      const cfg = activeConfig();
      $$renderer2.push(`<div class="panel svelte-1uha8ag"><h2 class="panel-title svelte-1uha8ag">Text</h2> <div class="field-col svelte-1uha8ag"><textarea placeholder="Headline" class="text-input svelte-1uha8ag" rows="2">`);
      const $$body = escape_html(cfg.headline);
      if ($$body) {
        $$renderer2.push(`${$$body}`);
      }
      $$renderer2.push(`</textarea> <input type="text"${attr("value", cfg.subheadline)} placeholder="Subheadline" class="text-input svelte-1uha8ag"/></div> <div class="field-row svelte-1uha8ag"><span class="field-label svelte-1uha8ag">Head size</span> <input type="range" min="24" max="220"${attr("value", cfg.headlineSize)} class="range-input svelte-1uha8ag"/> <span class="range-value svelte-1uha8ag">${escape_html(cfg.headlineSize)}</span></div> <div class="field-row svelte-1uha8ag"><span class="field-label svelte-1uha8ag">Sub size</span> <input type="range" min="16" max="140"${attr("value", cfg.subheadlineSize)} class="range-input svelte-1uha8ag"/> <span class="range-value svelte-1uha8ag">${escape_html(cfg.subheadlineSize)}</span></div> <div class="field-row svelte-1uha8ag"><span class="field-label svelte-1uha8ag">Color</span> <input type="color"${attr("value", cfg.textColor)} class="color-input svelte-1uha8ag"/></div> <div class="field-row svelte-1uha8ag"><span class="field-label svelte-1uha8ag">Y offset</span> <input type="range" min="-200" max="900"${attr("value", cfg.textYOffset)} class="range-input svelte-1uha8ag"/> <span class="range-value svelte-1uha8ag">${escape_html(cfg.textYOffset)}px</span></div> <div class="field-row svelte-1uha8ag"><span class="field-label svelte-1uha8ag">Max width</span> <input type="range" min="0.3" max="1" step="0.01"${attr("value", cfg.textMaxWidth)} class="range-input svelte-1uha8ag"/> <span class="range-value svelte-1uha8ag">${escape_html(Math.round(cfg.textMaxWidth * 100))}%</span></div> <div class="field-row svelte-1uha8ag"><span class="field-label svelte-1uha8ag">Shadow</span> <input type="range" min="0" max="60"${attr("value", cfg.shadowBlur)} class="range-input svelte-1uha8ag"/> <span class="range-value svelte-1uha8ag">${escape_html(cfg.shadowBlur)}</span></div></div> <div class="panel svelte-1uha8ag"><h2 class="panel-title svelte-1uha8ag">Background</h2> <div class="bg-tabs svelte-1uha8ag"><button${attr_class("tab svelte-1uha8ag", void 0, { "active": cfg.bgType === "solid" })} type="button">Solid</button> <button${attr_class("tab svelte-1uha8ag", void 0, { "active": cfg.bgType === "gradient" })} type="button">Gradient</button></div> `);
      if (cfg.bgType === "solid") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="field-row svelte-1uha8ag"><span class="field-label svelte-1uha8ag">Color</span> <input type="color"${attr("value", cfg.bgSolid)} class="color-input svelte-1uha8ag"/></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="field-row svelte-1uha8ag"><span class="field-label svelte-1uha8ag">From</span> <input type="color"${attr("value", cfg.bgGradientFrom)} class="color-input svelte-1uha8ag"/></div> <div class="field-row svelte-1uha8ag"><span class="field-label svelte-1uha8ag">To</span> <input type="color"${attr("value", cfg.bgGradientTo)} class="color-input svelte-1uha8ag"/></div> <div class="field-row svelte-1uha8ag"><span class="field-label svelte-1uha8ag">Angle</span> <input type="range" min="0" max="360"${attr("value", cfg.bgGradientAngle)} class="range-input svelte-1uha8ag"/> <span class="range-value svelte-1uha8ag">${escape_html(cfg.bgGradientAngle)}°</span></div>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="panel svelte-1uha8ag"><h2 class="panel-title svelte-1uha8ag">Screenshot position</h2> <div class="field-row svelte-1uha8ag"><span class="field-label svelte-1uha8ag">Scale</span> <input type="range" min="0.3" max="1.3" step="0.01"${attr("value", cfg.screenshotScale)} class="range-input svelte-1uha8ag"/> <span class="range-value svelte-1uha8ag">${escape_html(Math.round(cfg.screenshotScale * 100))}%</span></div> <div class="field-row svelte-1uha8ag"><span class="field-label svelte-1uha8ag">Y offset</span> <input type="range" min="-700" max="700"${attr("value", cfg.screenshotYOffset)} class="range-input svelte-1uha8ag"/> <span class="range-value svelte-1uha8ag">${escape_html(cfg.screenshotYOffset)}px</span></div> <div class="field-row svelte-1uha8ag"><span class="field-label svelte-1uha8ag">Rotate</span> <input type="range" min="-15" max="15"${attr("value", cfg.screenshotRotation)} class="range-input svelte-1uha8ag"/> <span class="range-value svelte-1uha8ag">${escape_html(cfg.screenshotRotation)}°</span></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></section></main>`);
  });
}
export {
  _page as default
};
