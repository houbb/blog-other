import { defineUserConfig } from "vuepress";
import { viteBundler } from '@vuepress/bundler-vite';
import theme from "./theme.js";
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineUserConfig({
  base: "/blog-backend/",

  bundler: viteBundler({
    viteOptions: {
      define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
      },
      worker: {
        plugins: [], // 这里保证 Worker 也经过 Vite 编译
      },
      build: {
        rollupOptions: {
          // 所有未解析模块都当外部模块忽略
          external: (id) => id.startsWith("/resources/") 
          || id.startsWith("/images") || id.startsWith("images/") || id.startsWith("uploads/")
        },
      },
      plugins: [
        {
          name: 'ignore-missing-assets',
          enforce: 'pre', // 关键：让它在 vite:asset 之前执行
          resolveId(source, importer) {
            if (/\.(png|jpe?g|gif|svg)$/.test(source)) {
              try {
                // 尝试解析真实路径
                const resolved = require('path').resolve(importer ? require('path').dirname(importer) : process.cwd(), source)
                if (!fs.existsSync(resolved)) {
                  console.warn(`[ignore-missing-assets] skip missing file: ${resolved}`)
                  return source + '?virtual-missing' // 标记一下
                }
              } catch (e) {
                return source + '?virtual-missing'
              }
            }
            return null
          },
          load(id) {
            if (id.endsWith('?virtual-missing')) {
              return `export default ""`
            }
            return null
          }
        }
      ]
    },

  }),


  locales: {
    "/": {
      lang: "zh-CN",
      title: "老马啸西风",
      description: "老马啸西风的技术博客",
    },
  },
  theme,

  extendsMarkdown: (md) => {
    // 在 markdown 转 HTML 之前，替换掉非法标签
    md.core.ruler.before("normalize", "remove-invalid-tags", (state) => {
      state.src = state.src
        // 例子：删除所有形如 </xxx> 的奇怪闭合标签
        .replace(/<\/[^>]+>/g, "")
        // 删除孤立的开标签
        .replace(/<[^>]+>/g, "");
    });
  },
});
