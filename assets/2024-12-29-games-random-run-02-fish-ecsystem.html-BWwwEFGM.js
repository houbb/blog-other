import{_ as i}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as n,a,o as l}from"./app-CEDSurVN.js";const e={};function p(t,s){return l(),n("div",null,s[0]||(s[0]=[a(`<h1 id="前言" tabindex="-1"><a class="header-anchor" href="#前言"><span>前言</span></a></h1><p>前两天刷视频，看到一个沙盒视频，感觉挺有趣，自己也想实现一下。</p><h1 id="在线体验" tabindex="-1"><a class="header-anchor" href="#在线体验"><span>在线体验</span></a></h1><p>游戏已经写好，在线版本：</p><blockquote><p><a href="https://houbb.github.io/games/slidingPuzzle/" target="_blank" rel="noopener noreferrer">https://houbb.github.io/games/slidingPuzzle/</a></p></blockquote><h1 id="设定" tabindex="-1"><a class="header-anchor" href="#设定"><span>设定</span></a></h1><p>要实现一个鱼缸生态沙盒的 HTML 实现，可以通过创建一个简单的模拟环境，其中有鱼、植物（比如水草）和水，模拟它们之间的互动关系，例如鱼吃植物、鱼之间的互动等。</p><p>以下是一个基于HTML和JavaScript的基本生态沙盒实现，包含了简单的生态系统，鱼的运动、植物的生长以及鱼和植物的互动。</p><h2 id="思路" tabindex="-1"><a class="header-anchor" href="#思路"><span>思路：</span></a></h2><ol><li><p>鱼：模拟鱼的运动，鱼有一定的速度，并且它们会在鱼缸中游动。鱼会吃水草并繁殖。</p></li><li><p>水草：水草会随着时间增长，但也会受到鱼的吃食影响。</p></li><li><p>生态规则：鱼吃水草，水草生长；鱼的种群数量随着时间变化，鱼的死亡和繁殖等。</p></li></ol><h2 id="实现步骤" tabindex="-1"><a class="header-anchor" href="#实现步骤"><span>实现步骤：</span></a></h2><ul><li>创建 <code>Fish</code> 类，模拟鱼的运动、吃食、死亡等行为。</li><li>创建 <code>Plant</code> 类，模拟水草的生长。</li><li>模拟一个简单的生态系统，其中鱼和水草之间互相作用。</li><li>通过定时更新和绘制来实现动态效果。</li></ul><h2 id="实现" tabindex="-1"><a class="header-anchor" href="#实现"><span>实现</span></a></h2><div class="language-html line-numbers-mode" data-highlighter="shiki" data-ext="html" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    </span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    </span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    Fish Tank Ecosystem</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    </span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        body {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            margin: 0;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            padding: 0;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            display: flex;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            justify-content: center;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            align-items: center;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            height: 100vh;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            background-color: #f0f0f0;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        canvas {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            border: 2px solid #000;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            background-color: #aaf;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    </span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    const canvas = document.getElementById(&quot;canvas&quot;);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    const ctx = canvas.getContext(&quot;2d&quot;);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    const numFish = 30; // 初始鱼的数量</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    const numPlants = 50; // 初始水草的数量</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    const maxFishSpeed = 2; // 鱼的最大速度</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    const maxPlantGrowth = 10; // 水草最大生长量</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    // 鱼类</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    class Fish {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        constructor(x, y) {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            this.position = { x, y };</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            this.velocity = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 }; // 随机方向</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            this.speed = Math.random() * maxFishSpeed;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        update() {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            // 鱼的运动</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            this.position.x += this.velocity.x * this.speed;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            this.position.y += this.velocity.y * this.speed;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            // 边界反射</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            if (this.position.x &gt; canvas.width || this.position.x  canvas.height || this.position.y  {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            plantArray.forEach(plant =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">                if (fish.eat(plant)) {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">                    // 如果鱼吃到水草，就停止循环</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">                    return;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">                }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            });</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        });</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        // 让水草生长</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        plantArray.forEach(plant =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            plant.grow();</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        });</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        // 更新鱼的位置</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        fishArray.forEach(fish =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            fish.update();</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        });</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    // 动画循环</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    function animate() {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        ctx.clearRect(0, 0, canvas.width, canvas.height);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        // 绘制水草</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        plantArray.forEach(plant =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            plant.draw();</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        });</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        // 绘制鱼</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        fishArray.forEach(fish =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            fish.draw();</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        });</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        // 更新生态系统</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        updateEcosystem();</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        requestAnimationFrame(animate);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    animate();</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="解释" tabindex="-1"><a class="header-anchor" href="#解释"><span>解释</span></a></h2><ol><li><p>鱼 (<code>Fish</code>) 类：</p><ul><li>位置 (<code>position</code>)：表示鱼的位置。</li><li>速度 (<code>velocity</code>)：表示鱼的运动方向。</li><li>速度 (<code>speed</code>)：控制鱼的游动速度。</li><li><code>update</code> 方法：根据鱼的速度更新位置，并处理边界反射。</li><li><code>eat</code> 方法：模拟鱼吃水草的行为，如果鱼靠近水草，则吃掉它，水草的大小减小。</li></ul></li><li><p>水草 (<code>Plant</code>) 类：</p><ul><li>位置 (<code>position</code>)：表示水草的位置。</li><li>大小 (<code>size</code>)：水草的大小，随着时间逐渐生长，最大值为 <code>maxPlantGrowth</code>。</li><li><code>grow</code> 方法：模拟水草的生长。</li><li><code>draw</code> 方法：绘制水草。</li></ul></li><li><p>生态系统：</p><ul><li>每一帧更新时，鱼会去寻找并吃掉附近的水草。</li><li>水草会不断生长，直到达到最大生长值。</li><li>鱼和水草相互作用，鱼吃掉水草后，水草的大小减少。</li></ul></li><li><p>动画：</p><ul><li>使用 <code>requestAnimationFrame</code> 来创建平滑的动画循环。</li><li>每一帧都会更新所有鱼和水草的位置以及状态。</li></ul></li></ol><h2 id="改进与扩展" tabindex="-1"><a class="header-anchor" href="#改进与扩展"><span>改进与扩展</span></a></h2><ol><li>鱼的繁殖：可以添加鱼的繁殖逻辑，当鱼吃到足够多的水草时，生成新的鱼。</li><li>鱼的死亡：可以根据鱼的能量或生命周期来模拟鱼的死亡，或者如果鱼没有食物（水草），它就会死亡。</li><li>多种鱼类：可以添加不同种类的鱼，它们有不同的速度、大小和行为。</li><li>水草的死亡：水草可以受到鱼食用的影响，逐渐枯萎或死亡。</li></ol><p>这个实现是一个基本的生态沙盒，可以通过增加更多的生态规则和交互来扩展这个系统，使其更加复杂和有趣。</p><h1 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h1>`,20)]))}const c=i(e,[["render",p]]),r=JSON.parse('{"path":"/posts/Games/2024-12-29-games-random-run-02-fish-ecsystem.html","title":"生态沙盒之鱼缸","lang":"zh-CN","frontmatter":{"title":"生态沙盒之鱼缸","date":"2024-12-29T00:00:00.000Z","categories":["Games"],"tags":["games","sh"],"published":true,"description":"前言 前两天刷视频，看到一个沙盒视频，感觉挺有趣，自己也想实现一下。 在线体验 游戏已经写好，在线版本： https://houbb.github.io/games/slidingPuzzle/ 设定 要实现一个鱼缸生态沙盒的 HTML 实现，可以通过创建一个简单的模拟环境，其中有鱼、植物（比如水草）和水，模拟它们之间的互动关系，例如鱼吃植物、鱼之间的...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/blog-other/posts/Games/2024-12-29-games-random-run-02-fish-ecsystem.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"生态沙盒之鱼缸"}],["meta",{"property":"og:description","content":"前言 前两天刷视频，看到一个沙盒视频，感觉挺有趣，自己也想实现一下。 在线体验 游戏已经写好，在线版本： https://houbb.github.io/games/slidingPuzzle/ 设定 要实现一个鱼缸生态沙盒的 HTML 实现，可以通过创建一个简单的模拟环境，其中有鱼、植物（比如水草）和水，模拟它们之间的互动关系，例如鱼吃植物、鱼之间的..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-08-22T03:45:14.000Z"}],["meta",{"property":"article:tag","content":"games"}],["meta",{"property":"article:tag","content":"sh"}],["meta",{"property":"article:published_time","content":"2024-12-29T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2025-08-22T03:45:14.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"生态沙盒之鱼缸\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2024-12-29T00:00:00.000Z\\",\\"dateModified\\":\\"2025-08-22T03:45:14.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1755834314000,"updatedTime":1755834314000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":1}]},"readingTime":{"minutes":3.95,"words":1184},"filePathRelative":"posts/Games/2024-12-29-games-random-run-02-fish-ecsystem.md","localizedDate":"2024年12月29日","excerpt":"\\n<p>前两天刷视频，看到一个沙盒视频，感觉挺有趣，自己也想实现一下。</p>\\n<h1>在线体验</h1>\\n<p>游戏已经写好，在线版本：</p>\\n<blockquote>\\n<p><a href=\\"https://houbb.github.io/games/slidingPuzzle/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://houbb.github.io/games/slidingPuzzle/</a></p>\\n</blockquote>\\n<h1>设定</h1>\\n<p>要实现一个鱼缸生态沙盒的 HTML 实现，可以通过创建一个简单的模拟环境，其中有鱼、植物（比如水草）和水，模拟它们之间的互动关系，例如鱼吃植物、鱼之间的互动等。</p>","autoDesc":true}');export{c as comp,r as data};
