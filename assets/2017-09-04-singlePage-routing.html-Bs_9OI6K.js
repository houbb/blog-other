import{_ as t}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as n,a as r,o as i}from"./app-uJE4P3e0.js";const a={};function o(s,e){return i(),n("div",null,e[0]||(e[0]=[r(`<p>#result {<br> height: 100px;<br> line-height: 100px;<br> font-size: 2rem;<br> text-align: center;<br> color: #fff;<br> }</p><h1 id="single-page-routing" tabindex="-1"><a class="header-anchor" href="#single-page-routing"><span>Single Page Routing</span></a></h1><p><a href="https://www.zhihu.com/question/20792064" target="_blank" rel="noopener noreferrer">单页应用有那些优缺点</a></p><p>我觉得只要够酷，就值得一试。</p><h1 id="page-js" tabindex="-1"><a class="header-anchor" href="#page-js"><span>Page.js</span></a></h1><p><a href="http://visionmedia.github.io/page.js/" target="_blank" rel="noopener noreferrer">Page.js</a> Tiny ~1200 byte Express-inspired client-side router.</p><h1 id="director-js" tabindex="-1"><a class="header-anchor" href="#director-js"><span>Director.js</span></a></h1><p><a href="https://github.com/flatiron/director" target="_blank" rel="noopener noreferrer">Director.js</a> is a tiny and isomorphic URL router for JavaScript.</p><h1 id="example" tabindex="-1"><a class="header-anchor" href="#example"><span>Example</span></a></h1><p>第一页<br> 第二页</p><pre><code>function Router(){
    this.routes = {};
    this.curUrl = &#39;&#39;;
    
    this.route = function(path, callback){
        this.routes[path] = callback || function(){};
    };
    
    this.refresh = function(){
        this.curUrl = location.hash.slice(1) || &#39;/&#39;;
        this.routes[this.curUrl]();
    };
    
    this.init = function(){
        window.addEventListener(&#39;load&#39;, this.refresh.bind(this), false);
        window.addEventListener(&#39;hashchange&#39;, this.refresh.bind(this), false);
    }
}

var R = new Router();
R.init();
var res = document.getElementById(&#39;result&#39;);

R.route(&#39;/first&#39;, function() {
   res.style.background = &#39;orange&#39;;
	res.innerHTML = &#39;这是第一页&#39;;
});
R.route(&#39;/second&#39;, function() {
   res.style.background = &#39;black&#39;;
	res.innerHTML = &#39;这是第二页&#39;;
});
</code></pre>`,11)]))}const l=t(a,[["render",o]]),c=JSON.parse('{"path":"/posts/UI/2017-09-04-singlePage-routing.html","title":"Single Page Routing","lang":"zh-CN","frontmatter":{"title":"Single Page Routing","date":"2017-09-04T00:00:00.000Z","categories":["UI"],"tags":["ui"],"published":true,"description":"#result { height: 100px; line-height: 100px; font-size: 2rem; text-align: center; color: #fff; } Single Page Routing 单页应用有那些优缺点 我觉得只要够酷，就值得一试。 Page.js Page.js Tiny ~1200 byte Ex...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/blog-backend/posts/UI/2017-09-04-singlePage-routing.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"Single Page Routing"}],["meta",{"property":"og:description","content":"#result { height: 100px; line-height: 100px; font-size: 2rem; text-align: center; color: #fff; } Single Page Routing 单页应用有那些优缺点 我觉得只要够酷，就值得一试。 Page.js Page.js Tiny ~1200 byte Ex..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-08-22T03:45:14.000Z"}],["meta",{"property":"article:tag","content":"ui"}],["meta",{"property":"article:published_time","content":"2017-09-04T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2025-08-22T03:45:14.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Single Page Routing\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2017-09-04T00:00:00.000Z\\",\\"dateModified\\":\\"2025-08-22T03:45:14.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1755834314000,"updatedTime":1755834314000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":1}]},"readingTime":{"minutes":0.59,"words":178},"filePathRelative":"posts/UI/2017-09-04-singlePage-routing.md","localizedDate":"2017年9月4日","excerpt":"<p>#result {<br>\\nheight: 100px;<br>\\nline-height: 100px;<br>\\nfont-size: 2rem;<br>\\ntext-align: center;<br>\\ncolor: #fff;<br>\\n}</p>\\n<h1>Single Page Routing</h1>\\n<p><a href=\\"https://www.zhihu.com/question/20792064\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">单页应用有那些优缺点</a></p>\\n<p>我觉得只要够酷，就值得一试。</p>\\n<h1>Page.js</h1>","autoDesc":true}');export{l as comp,c as data};
