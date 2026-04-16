<script lang="ts">
	import JSZip from 'jszip';
	import { onMount } from 'svelte';

	type Size = {
		name: string;
		width: number;
		height: number;
	};

	const SIZES: Size[] = [
		{ name: 'iPhone 6.7"', width: 1290, height: 2796 },
		{ name: 'iPhone 6.5"', width: 1284, height: 2778 },
		{ name: 'iPhone 5.5"', width: 1242, height: 2208 },
		{ name: 'iPad Pro 12.9"', width: 2048, height: 2732 },
		{ name: 'iPad Pro 11"', width: 1668, height: 2388 },
		{ name: 'Android Phone', width: 1080, height: 1920 },
		{ name: 'Android Tablet', width: 1640, height: 2360 }
	];

	type Config = {
		id: string;
		name: string;
		img: HTMLImageElement | null;
		headline: string;
		subheadline: string;
		headlineSize: number;
		subheadlineSize: number;
		textColor: string;
		textYOffset: number;
		textMaxWidth: number;
		screenshotScale: number;
		screenshotYOffset: number;
		screenshotRotation: number;
		bgType: 'solid' | 'gradient' | 'image';
		bgSolid: string;
		bgGradientFrom: string;
		bgGradientTo: string;
		bgGradientAngle: number;
		shadowBlur: number;
		shadowColor: string;
	};

	let configs: Config[] = $state([]);
	let activeConfigId = $state('');
	let selectedSizeIndex = $state(0);
	let canvasEl: HTMLCanvasElement | null = $state(null);
	let isExporting = $state(false);
	let dragOverIndex: number | null = $state(null);

	const activeConfig = $derived(configs.find((c) => c.id === activeConfigId) ?? configs[0]);
	const selectedSize = $derived(SIZES[selectedSizeIndex]);

	function newConfig(name = 'Screenshot'): Config {
		return {
			id: Math.random().toString(36).slice(2),
			name,
			img: null,
			headline: 'Your Headline',
			subheadline: 'A short line that sells the feature.',
			headlineSize: 96,
			subheadlineSize: 52,
			textColor: '#ffffff',
			textYOffset: 220,
			textMaxWidth: 0.85,
			screenshotScale: 0.82,
			screenshotYOffset: 120,
			screenshotRotation: 0,
			bgType: 'gradient',
			bgSolid: '#1CADFA',
			bgGradientFrom: '#1CADFA',
			bgGradientTo: '#E42792',
			bgGradientAngle: 135,
			shadowBlur: 16,
			shadowColor: 'rgba(0,0,0,0.35)'
		};
	}

	function applyDoodleMashupsPreset() {
		const base = newConfig('Doodle Mashups');
		base.bgGradientFrom = '#1CADFA';
		base.bgGradientTo = '#E42792';
		base.textColor = '#ffffff';
		base.shadowBlur = 20;
		base.shadowColor = 'rgba(0,0,0,0.45)';
		base.headlineSize = 110;
		base.subheadlineSize = 56;
		base.textYOffset = 260;
		base.screenshotScale = 0.78;
		base.screenshotYOffset = 160;
		return base;
	}

	function ensureDefaultConfigs() {
		if (configs.length === 0) {
			const items = [
				{ name: 'Screenshot 1', headline: 'Mix 2 Words.\nDraw Something Wild!', sub: '172 Mashup Prompts' },
				{ name: 'Screenshot 2', headline: 'Thousands of\nSilly Combos!', sub: 'Every round is a surprise' },
				{ name: 'Screenshot 3', headline: 'Race the Clock!', sub: '30 sec to 5 min challenges' },
				{ name: 'Screenshot 4', headline: '15 Colors +\nPro Tools', sub: 'Pen, marker, eraser & more' },
				{ name: 'Screenshot 5', headline: 'Or Just Draw —\nNo Timer!', sub: 'Perfect for calm creative time' },
				{ name: 'Screenshot 6', headline: 'Every Drawing Is\na Masterpiece', sub: 'Save & share your art' },
				{ name: 'Screenshot 7', headline: 'No Ads. No Tracking.\nJust Fun.', sub: 'COPPA compliant & kid-safe' },
				{ name: 'Screenshot 8', headline: 'Perfect for\nAges 5-12', sub: 'Birthday parties • Road trips • Family nights' },
				{ name: 'Screenshot 9', headline: 'By Carolina\nThe Doodler', sub: 'The artist behind the doodle videos' },
				{ name: 'Screenshot 10', headline: 'Start Mashing —\nDownload Now!', sub: '$4.99 — one-time, no subscriptions' }
			];
			const built = items.map((it) => {
				const c = applyDoodleMashupsPreset();
				c.name = it.name;
				c.headline = it.headline;
				c.subheadline = it.sub;
				return c;
			});
			configs = built;
			activeConfigId = built[0].id;
		}
	}

	onMount(() => {
		ensureDefaultConfigs();
		draw();
	});

	function addConfig() {
		const c = applyDoodleMashupsPreset();
		c.name = `Screenshot ${configs.length + 1}`;
		configs = [...configs, c];
		activeConfigId = c.id;
	}

	function duplicateConfig() {
		if (!activeConfig) return;
		const c = { ...activeConfig, id: Math.random().toString(36).slice(2), name: `${activeConfig.name} copy` };
		configs = [...configs, c];
		activeConfigId = c.id;
	}

	function removeConfig(id: string) {
		if (configs.length <= 1) return;
		configs = configs.filter((c) => c.id !== id);
		if (activeConfigId === id) activeConfigId = configs[0].id;
	}

	function loadImage(file: File): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			const url = URL.createObjectURL(file);
			const img = new Image();
			img.onload = () => {
				URL.revokeObjectURL(url);
				resolve(img);
			};
			img.onerror = reject;
			img.src = url;
		});
	}

	async function onConfigImage(file: File, configId: string) {
		const img = await loadImage(file);
		configs = configs.map((c) => (c.id === configId ? { ...c, img } : c));
	}

	function draw() {
		if (!canvasEl || !activeConfig) return;
		const ctx = canvasEl.getContext('2d');
		if (!ctx) return;

		const { width: W, height: H } = selectedSize;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		const previewWidth = Math.min(W, 520);
		const scale = previewWidth / W;
		const previewHeight = Math.round(H * scale);

		canvasEl.style.width = `${previewWidth}px`;
		canvasEl.style.height = `${previewHeight}px`;
		canvasEl.width = Math.round(previewWidth * dpr);
		canvasEl.height = Math.round(previewHeight * dpr);

		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		renderContext(ctx, previewWidth, previewHeight, scale, activeConfig);
	}

	function renderContext(
		ctx: CanvasRenderingContext2D,
		W: number,
		H: number,
		scale: number,
		cfg: Config
	) {
		if (cfg.bgType === 'solid') {
			ctx.fillStyle = cfg.bgSolid;
			ctx.fillRect(0, 0, W, H);
		} else if (cfg.bgType === 'gradient') {
			const rad = (cfg.bgGradientAngle * Math.PI) / 180;
			const dx = Math.cos(rad) * W * 0.5;
			const dy = Math.sin(rad) * H * 0.5;
			const grad = ctx.createLinearGradient(W / 2 - dx, H / 2 - dy, W / 2 + dx, H / 2 + dy);
			grad.addColorStop(0, cfg.bgGradientFrom);
			grad.addColorStop(1, cfg.bgGradientTo);
			ctx.fillStyle = grad;
			ctx.fillRect(0, 0, W, H);
		} else if (cfg.img) {
			ctx.fillStyle = '#0b0c0f';
			ctx.fillRect(0, 0, W, H);
		}

		if (cfg.img) {
			const maxW = W * 0.86;
			const maxH = H * 0.72;
			const r = Math.min(maxW / cfg.img.width, maxH / cfg.img.height, 1);
			const baseW = cfg.img.width * r;
			const baseH = cfg.img.height * r;
			const w = baseW * cfg.screenshotScale;
			const h = baseH * cfg.screenshotScale;
			const x = W / 2;
			const y = H / 2 + cfg.screenshotYOffset * scale;

			ctx.save();
			ctx.translate(x, y);
			ctx.rotate((cfg.screenshotRotation * Math.PI) / 180);
			ctx.drawImage(cfg.img, -w / 2, -h / 2, w, h);
			ctx.restore();
		}

		ctx.textAlign = 'center';
		ctx.fillStyle = cfg.textColor;

		const headSize = Math.max(16, cfg.headlineSize * scale);
		ctx.font = `700 ${headSize}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif`;
		const headY = H * 0.12 + cfg.textYOffset * scale;
		ctx.shadowColor = cfg.shadowColor;
		ctx.shadowBlur = cfg.shadowBlur * scale;
		wrapText(ctx, cfg.headline, W / 2, headY, W * cfg.textMaxWidth, headSize * 1.15);

		if (cfg.subheadline.trim()) {
			const subSize = Math.max(12, cfg.subheadlineSize * scale);
			ctx.font = `500 ${subSize}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif`;
			const subY = headY + headSize * 1.35;
			wrapText(ctx, cfg.subheadline, W / 2, subY, W * cfg.textMaxWidth, subSize * 1.2);
		}

		ctx.shadowBlur = 0;
	}

	function wrapText(
		ctx: CanvasRenderingContext2D,
		text: string,
		x: number,
		y: number,
		maxWidth: number,
		lineHeight: number
	) {
		const paragraphs = text.split('\n');
		let currentY = y;
		for (const para of paragraphs) {
			const words = para.split(' ');
			let line = '';
			const lines: string[] = [];
			for (let i = 0; i < words.length; i++) {
				const test = line + words[i] + ' ';
				const metrics = ctx.measureText(test);
				if (metrics.width > maxWidth && i > 0) {
					lines.push(line.trim());
					line = words[i] + ' ';
				} else {
					line = test;
				}
			}
			lines.push(line.trim());
			for (let i = 0; i < lines.length; i++) {
				ctx.fillText(lines[i], x, currentY + i * lineHeight);
			}
			currentY += lines.length * lineHeight;
		}
	}

	function renderFullSize(cfg: Config, size: Size): Promise<Blob> {
		return new Promise((resolve) => {
			const c = document.createElement('canvas');
			c.width = size.width;
			c.height = size.height;
			const ctx = c.getContext('2d');
			if (!ctx) return;
			renderContext(ctx, size.width, size.height, 1, cfg);
			c.toBlob((blob) => {
				if (blob) resolve(blob);
			}, 'image/png');
		});
	}

	async function exportCurrent() {
		if (!activeConfig) return;
		const blob = await renderFullSize(activeConfig, selectedSize);
		triggerDownload(blob, `${sanitize(activeConfig.name)}-${sanitize(selectedSize.name)}.png`);
	}

	async function exportAllConfigsCurrentSize() {
		if (!configs.length) return;
		isExporting = true;
		try {
			const zip = new JSZip();
			for (const cfg of configs) {
				if (!cfg.img) continue;
				const blob = await renderFullSize(cfg, selectedSize);
				zip.file(`${sanitize(cfg.name)}-${sanitize(selectedSize.name)}.png`, blob);
			}
			const content = await zip.generateAsync({ type: 'blob' });
			triggerDownload(content, `doodle-mashups-${sanitize(selectedSize.name)}.zip`);
		} finally {
			isExporting = false;
		}
	}

	async function exportAllConfigsAllSizes() {
		if (!configs.length) return;
		isExporting = true;
		try {
			const zip = new JSZip();
			for (const cfg of configs) {
				if (!cfg.img) continue;
				for (const size of SIZES) {
					const blob = await renderFullSize(cfg, size);
					zip.file(`${sanitize(cfg.name)}/${sanitize(size.name)}.png`, blob);
				}
			}
			const content = await zip.generateAsync({ type: 'blob' });
			triggerDownload(content, 'doodle-mashups-all.zip');
		} finally {
			isExporting = false;
		}
	}

	function triggerDownload(blob: Blob, filename: string) {
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	}

	function sanitize(name: string) {
		return name.replace(/[^a-z0-9]+/gi, '-').toLowerCase().replace(/(^-|-$)/g, '');
	}

	$effect(() => {
		activeConfig;
		selectedSizeIndex;
		draw();
	});
</script>

<svelte:head>
	<title>Doodle Shot — App Store screenshots for Doodle Mashups</title>
</svelte:head>

<main class="app">
	<header class="app-header">
		<h1 class="logo">Doodle Shot</h1>
		<p class="tagline">App Store screenshots for Doodle Mashups. No login. No paywall. Entirely offline.</p>
	</header>

	<section class="workspace">
		<div class="preview-col">
			<div class="size-bar">
				{#each SIZES as size, idx (size.name)}
					<button class="size-chip" class:active={selectedSizeIndex === idx} onclick={() => (selectedSizeIndex = idx)} type="button">
						{size.name}
					</button>
				{/each}
			</div>

			{#if activeConfig}
				{@const cfg = activeConfig}
				{@const cfgIndex = configs.findIndex((c) => c.id === cfg.id)}
				<div
					class="dropzone"
					class:active={dragOverIndex === cfgIndex}
					role="button"
					tabindex="0"
					ondragover={(e) => { e.preventDefault(); dragOverIndex = cfgIndex; }}
					ondragleave={() => dragOverIndex = null}
					ondrop={(e) => {
						e.preventDefault();
						dragOverIndex = null;
						const file = e.dataTransfer?.files?.[0];
						if (file) onConfigImage(file, cfg.id);
					}}
					onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') document.getElementById(`file-${cfg.id}`)?.click(); }}
				>
					{#if cfg.img}
						<canvas bind:this={canvasEl} class="preview-canvas"></canvas>
					{:else}
						<div class="empty">
							<div class="empty-icon">📱</div>
							<p class="empty-title">Drop screenshot here</p>
							<p class="empty-hint">or click to browse</p>
						</div>
					{/if}
					<input
						id={`file-${cfg.id}`}
						type="file"
						accept="image/*"
						onchange={(e) => {
							const file = e.currentTarget.files?.[0];
							if (file) onConfigImage(file, cfg.id);
						}}
						class="file-input"
					/>
				</div>
			{/if}

			<div class="preview-actions">
				<button class="btn-primary" onclick={exportCurrent} disabled={!activeConfig?.img}>
					Download {selectedSize.name}
				</button>
				<button class="btn-secondary" onclick={exportAllConfigsCurrentSize} disabled={isExporting || !configs.some((c) => c.img)}>
					{isExporting ? 'Exporting…' : `Export all configs · ${selectedSize.name}`}
				</button>
				<button class="btn-secondary" onclick={exportAllConfigsAllSizes} disabled={isExporting || !configs.some((c) => c.img)}>
					{isExporting ? 'Exporting…' : 'Export all configs · all sizes'}
				</button>
			</div>
		</div>

		<div class="controls-col">
			<div class="panel">
				<div class="panel-header">
					<h2 class="panel-title">Screenshots ({configs.length})</h2>
					<div class="panel-actions">
						<button class="icon-btn" title="Add" onclick={addConfig} type="button">＋</button>
						<button class="icon-btn" title="Duplicate" onclick={duplicateConfig} type="button">⧉</button>
					</div>
				</div>
				<div class="config-list">
					{#each configs as c, i (c.id)}
						<div class="config-row" class:active={activeConfigId === c.id}>
							<button class="config-name" onclick={() => (activeConfigId = c.id)} type="button">
								<span class="config-badge">{i + 1}</span>
								<input
									type="text"
									value={c.name}
									onclick={(e) => e.stopPropagation()}
									onchange={(e) => {
										configs = configs.map((x) => (x.id === c.id ? { ...x, name: e.currentTarget.value } : x));
									}}
									class="config-input"
								/>
							</button>
							{#if configs.length > 1}
								<button class="icon-btn small" title="Remove" onclick={() => removeConfig(c.id)} type="button">×</button>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			{#if activeConfig}
				{@const cfg = activeConfig}
				<div class="panel">
					<h2 class="panel-title">Text</h2>
					<div class="field-col">
						<textarea
							value={cfg.headline}
							oninput={(e) => {
								configs = configs.map((c) => (c.id === cfg.id ? { ...c, headline: e.currentTarget.value } : c));
							}}
							placeholder="Headline"
							class="text-input"
							rows="2"
						></textarea>
						<input
							type="text"
							value={cfg.subheadline}
							oninput={(e) => {
								configs = configs.map((c) => (c.id === cfg.id ? { ...c, subheadline: e.currentTarget.value } : c));
							}}
							placeholder="Subheadline"
							class="text-input"
						/>
					</div>
					<div class="field-row">
						<span class="field-label">Head size</span>
						<input
							type="range"
							min="24"
							max="220"
							value={cfg.headlineSize}
							oninput={(e) => {
								const v = parseInt(e.currentTarget.value, 10);
								configs = configs.map((c) => (c.id === cfg.id ? { ...c, headlineSize: v } : c));
							}}
							class="range-input"
						/>
						<span class="range-value">{cfg.headlineSize}</span>
					</div>
					<div class="field-row">
						<span class="field-label">Sub size</span>
						<input
							type="range"
							min="16"
							max="140"
							value={cfg.subheadlineSize}
							oninput={(e) => {
								const v = parseInt(e.currentTarget.value, 10);
								configs = configs.map((c) => (c.id === cfg.id ? { ...c, subheadlineSize: v } : c));
							}}
							class="range-input"
						/>
						<span class="range-value">{cfg.subheadlineSize}</span>
					</div>
					<div class="field-row">
						<span class="field-label">Color</span>
						<input
							type="color"
							value={cfg.textColor}
							oninput={(e) => {
								configs = configs.map((c) => (c.id === cfg.id ? { ...c, textColor: e.currentTarget.value } : c));
							}}
							class="color-input"
						/>
					</div>
					<div class="field-row">
						<span class="field-label">Y offset</span>
						<input
							type="range"
							min="-200"
							max="900"
							value={cfg.textYOffset}
							oninput={(e) => {
								const v = parseInt(e.currentTarget.value, 10);
								configs = configs.map((c) => (c.id === cfg.id ? { ...c, textYOffset: v } : c));
							}}
							class="range-input"
						/>
						<span class="range-value">{cfg.textYOffset}px</span>
					</div>
					<div class="field-row">
						<span class="field-label">Max width</span>
						<input
							type="range"
							min="0.3"
							max="1"
							step="0.01"
							value={cfg.textMaxWidth}
							oninput={(e) => {
								const v = parseFloat(e.currentTarget.value);
								configs = configs.map((c) => (c.id === cfg.id ? { ...c, textMaxWidth: v } : c));
							}}
							class="range-input"
						/>
						<span class="range-value">{Math.round(cfg.textMaxWidth * 100)}%</span>
					</div>
					<div class="field-row">
						<span class="field-label">Shadow</span>
						<input
							type="range"
							min="0"
							max="60"
							value={cfg.shadowBlur}
							oninput={(e) => {
								const v = parseInt(e.currentTarget.value, 10);
								configs = configs.map((c) => (c.id === cfg.id ? { ...c, shadowBlur: v } : c));
							}}
							class="range-input"
						/>
						<span class="range-value">{cfg.shadowBlur}</span>
					</div>
				</div>

				<div class="panel">
					<h2 class="panel-title">Background</h2>
					<div class="bg-tabs">
						<button class="tab" class:active={cfg.bgType === 'solid'} onclick={() => (configs = configs.map((c) => c.id === cfg.id ? { ...c, bgType: 'solid' } : c))} type="button">Solid</button>
						<button class="tab" class:active={cfg.bgType === 'gradient'} onclick={() => (configs = configs.map((c) => c.id === cfg.id ? { ...c, bgType: 'gradient' } : c))} type="button">Gradient</button>
					</div>

					{#if cfg.bgType === 'solid'}
						<div class="field-row">
							<span class="field-label">Color</span>
							<input
								type="color"
								value={cfg.bgSolid}
								oninput={(e) => {
									configs = configs.map((c) => (c.id === cfg.id ? { ...c, bgSolid: e.currentTarget.value } : c));
								}}
								class="color-input"
							/>
						</div>
					{:else}
						<div class="field-row">
							<span class="field-label">From</span>
							<input
								type="color"
								value={cfg.bgGradientFrom}
								oninput={(e) => {
									configs = configs.map((c) => (c.id === cfg.id ? { ...c, bgGradientFrom: e.currentTarget.value } : c));
								}}
								class="color-input"
							/>
						</div>
						<div class="field-row">
							<span class="field-label">To</span>
							<input
								type="color"
								value={cfg.bgGradientTo}
								oninput={(e) => {
									configs = configs.map((c) => (c.id === cfg.id ? { ...c, bgGradientTo: e.currentTarget.value } : c));
								}}
								class="color-input"
							/>
						</div>
						<div class="field-row">
							<span class="field-label">Angle</span>
							<input
								type="range"
								min="0"
								max="360"
								value={cfg.bgGradientAngle}
								oninput={(e) => {
									const v = parseInt(e.currentTarget.value, 10);
									configs = configs.map((c) => (c.id === cfg.id ? { ...c, bgGradientAngle: v } : c));
								}}
								class="range-input"
							/>
							<span class="range-value">{cfg.bgGradientAngle}°</span>
						</div>
					{/if}
				</div>

				<div class="panel">
					<h2 class="panel-title">Screenshot position</h2>
					<div class="field-row">
						<span class="field-label">Scale</span>
						<input
							type="range"
							min="0.3"
							max="1.3"
							step="0.01"
							value={cfg.screenshotScale}
							oninput={(e) => {
								const v = parseFloat(e.currentTarget.value);
								configs = configs.map((c) => (c.id === cfg.id ? { ...c, screenshotScale: v } : c));
							}}
							class="range-input"
						/>
						<span class="range-value">{Math.round(cfg.screenshotScale * 100)}%</span>
					</div>
					<div class="field-row">
						<span class="field-label">Y offset</span>
						<input
							type="range"
							min="-700"
							max="700"
							value={cfg.screenshotYOffset}
							oninput={(e) => {
								const v = parseInt(e.currentTarget.value, 10);
								configs = configs.map((c) => (c.id === cfg.id ? { ...c, screenshotYOffset: v } : c));
							}}
							class="range-input"
						/>
						<span class="range-value">{cfg.screenshotYOffset}px</span>
					</div>
					<div class="field-row">
						<span class="field-label">Rotate</span>
						<input
							type="range"
							min="-15"
							max="15"
							value={cfg.screenshotRotation}
							oninput={(e) => {
								const v = parseInt(e.currentTarget.value, 10);
								configs = configs.map((c) => (c.id === cfg.id ? { ...c, screenshotRotation: v } : c));
							}}
							class="range-input"
						/>
						<span class="range-value">{cfg.screenshotRotation}°</span>
					</div>
				</div>
			{/if}
		</div>
	</section>
</main>

<style>
	.app {
		min-height: 100vh;
		padding: 20px;
	}

	.app-header {
		max-width: 1200px;
		margin: 0 auto 16px;
	}

	.logo {
		margin: 0;
		font-size: 20px;
		font-weight: 700;
		letter-spacing: -0.2px;
	}

	.tagline {
		margin: 4px 0 0;
		color: var(--text-dim);
		font-size: 13px;
	}

	.workspace {
		display: grid;
		grid-template-columns: 1fr 380px;
		gap: 20px;
		max-width: 1200px;
		margin: 0 auto;
	}

	@media (max-width: 980px) {
		.workspace {
			grid-template-columns: 1fr;
		}
	}

	.preview-col {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.size-bar {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.size-chip {
		padding: 6px 10px;
		border-radius: 999px;
		background: var(--surface);
		color: var(--text);
		font-size: 12px;
		border: 1px solid var(--border);
		font-weight: 500;
	}

	.size-chip.active {
		background: var(--accent);
		color: #1a0b10;
		border-color: var(--accent);
		font-weight: 600;
	}

	.dropzone {
		position: relative;
		min-height: 520px;
		background: var(--surface);
		border: 2px dashed var(--border);
		border-radius: var(--radius);
		display: grid;
		place-items: center;
		overflow: auto;
	}

	.dropzone.active {
		border-color: var(--accent);
		background: rgba(244, 143, 177, 0.08);
	}

	.preview-canvas {
		display: block;
		box-shadow: var(--shadow);
		border-radius: var(--radius-sm);
		margin: 20px;
	}

	.empty {
		text-align: center;
		padding: 40px;
	}

	.empty-icon {
		font-size: 40px;
		margin-bottom: 8px;
	}

	.empty-title {
		margin: 0;
		font-weight: 600;
		font-size: 16px;
	}

	.empty-hint {
		margin: 4px 0 0;
		color: var(--text-dim);
		font-size: 13px;
	}

	.file-input {
		position: absolute;
		inset: 0;
		opacity: 0;
		cursor: pointer;
	}

	.preview-actions {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
	}

	.btn-primary {
		padding: 10px 14px;
		border-radius: var(--radius-sm);
		background: var(--accent);
		color: #1a0b10;
		font-weight: 600;
		font-size: 14px;
	}

	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-secondary {
		padding: 10px 14px;
		border-radius: var(--radius-sm);
		background: var(--surface-2);
		color: var(--text);
		font-weight: 500;
		font-size: 14px;
		border: 1px solid var(--border);
	}

	.btn-secondary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.controls-col {
		display: flex;
		flex-direction: column;
		gap: 14px;
		max-height: calc(100vh - 40px);
		overflow: auto;
	}

	.panel {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 14px;
	}

	.panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 10px;
	}

	.panel-title {
		margin: 0;
		font-size: 12px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.4px;
		color: var(--text-dim);
	}

	.panel-actions {
		display: flex;
		gap: 6px;
	}

	.icon-btn {
		width: 28px;
		height: 28px;
		border-radius: var(--radius-sm);
		background: var(--surface-2);
		color: var(--text);
		font-size: 16px;
		line-height: 1;
		border: 1px solid var(--border);
		display: grid;
		place-items: center;
	}

	.icon-btn.small {
		width: 24px;
		height: 24px;
		font-size: 14px;
	}

	.config-list {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.config-row {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 6px 8px;
		border-radius: var(--radius-sm);
		background: var(--surface-2);
		border: 1px solid var(--border);
	}

	.config-row.active {
		border-color: var(--accent);
		background: rgba(244, 143, 177, 0.12);
	}

	.config-name {
		flex: 1 1 auto;
		display: flex;
		align-items: center;
		gap: 8px;
		background: transparent;
		color: var(--text);
		border: none;
		padding: 0;
		text-align: left;
	}

	.config-badge {
		width: 20px;
		height: 20px;
		border-radius: 999px;
		background: var(--surface);
		color: var(--text-dim);
		font-size: 11px;
		font-weight: 600;
		display: grid;
		place-items: center;
	}

	.config-input {
		flex: 1 1 auto;
		background: transparent;
		border: none;
		color: var(--text);
		font-size: 13px;
		padding: 2px 0;
	}

	.bg-tabs {
		display: flex;
		gap: 8px;
		margin-bottom: 10px;
	}

	.tab {
		flex: 1 1 0;
		padding: 8px 0;
		border-radius: var(--radius-sm);
		background: var(--surface-2);
		color: var(--text);
		font-size: 13px;
		border: 1px solid var(--border);
	}

	.tab.active {
		background: var(--accent-2);
		color: #1a0b10;
		border-color: var(--accent-2);
		font-weight: 600;
	}

	.field-row {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 8px;
	}

	.field-label {
		width: 80px;
		font-size: 12px;
		color: var(--text-dim);
	}

	.color-input {
		width: 40px;
		height: 26px;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		background: transparent;
		cursor: pointer;
	}

	.range-input {
		flex: 1 1 auto;
	}

	.range-value {
		width: 48px;
		text-align: right;
		font-size: 12px;
		color: var(--text-dim);
		font-variant-numeric: tabular-nums;
	}

	.text-input,
	textarea.text-input {
		width: 100%;
		padding: 10px 12px;
		border-radius: var(--radius-sm);
		border: 1px solid var(--border);
		background: var(--surface-2);
		color: var(--text);
		font-size: 14px;
		margin-bottom: 8px;
		resize: vertical;
	}

	.text-input::placeholder {
		color: var(--text-dim);
	}

	.field-col {
		display: flex;
		flex-direction: column;
		gap: 0;
	}
</style>
