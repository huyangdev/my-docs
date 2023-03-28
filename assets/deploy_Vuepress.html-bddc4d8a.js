import{_ as a,W as i,X as t,a0 as o,Y as n,Z as s,$ as c,a1 as l,C as p}from"./framework-b5ea9e64.js";const u="/my-docs/assets/image-0599-e75f8451.png",d="/my-docs/assets/image-4885-ebf6548b.png",r="/my-docs/assets/image-0341-da9eb0bf.png",m="/my-docs/assets/image-0231_Github_page-dc8b3d11.png",v={},k=n("p",null,[s("部署 "),n("code",null,"Vuepress"),s(" 项目到 "),n("code",null,"Github Page"),s(" 上，并且使用 "),n("code",null,"Vuepress-theme-hope"),s(" 主题。")],-1),b=n("h1",{id:"_1-vuepress-heme-hope-的使用",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#_1-vuepress-heme-hope-的使用","aria-hidden":"true"},"#"),s(" 1. vuepress-heme-hope 的使用")],-1),h={href:"https://vuepress-theme-hope.github.io/v2/cookbook/#tutorial",target:"_blank",rel:"noopener noreferrer"},g=l(`<p>依次安装：nodejs、pnpm</p><h1 id="_2-创建项目" tabindex="-1"><a class="header-anchor" href="#_2-创建项目" aria-hidden="true">#</a> 2. 创建项目</h1><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">pnpm</span> create vuepress-theme-hope my-docs
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><figure><img src="`+u+`" alt="image-20230320173330881" tabindex="0" loading="lazy"><figcaption>image-20230320173330881</figcaption></figure><p>需要注意的是 <code>Do you need a GitHub workflow to deploy docs on GitHub pages? Yes</code> 这个问题要选择 <code>Y</code>，不过不选择也没事，后续手动创建 <code>my-docs\\.github\\workflows\\deploy-docs.yml</code>即可。</p><p>deploy-docs.yml的内容如下（只需要将相关工具的版本修改为匹配自己的环境即可）：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code>
<span class="token key atrule">name</span><span class="token punctuation">:</span> Deploy Docs

<span class="token key atrule">on</span><span class="token punctuation">:</span>
  <span class="token key atrule">push</span><span class="token punctuation">:</span>
    <span class="token key atrule">branches</span><span class="token punctuation">:</span>
      <span class="token comment"># make sure this is the branch you are using</span>
      <span class="token punctuation">-</span> main

<span class="token key atrule">jobs</span><span class="token punctuation">:</span>
  <span class="token key atrule">deploy-gh-pages</span><span class="token punctuation">:</span>
    <span class="token key atrule">runs-on</span><span class="token punctuation">:</span> ubuntu<span class="token punctuation">-</span>latest
    <span class="token key atrule">steps</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Checkout
        <span class="token key atrule">uses</span><span class="token punctuation">:</span> actions/checkout@v3
        <span class="token key atrule">with</span><span class="token punctuation">:</span>
          <span class="token key atrule">fetch-depth</span><span class="token punctuation">:</span> <span class="token number">0</span>
          <span class="token comment"># if your docs needs submodules, uncomment the following line</span>
          <span class="token comment"># submodules: true</span>

      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Install pnpm
        <span class="token key atrule">uses</span><span class="token punctuation">:</span> pnpm/action<span class="token punctuation">-</span>setup@v2
        <span class="token key atrule">with</span><span class="token punctuation">:</span>
          <span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token number">7</span>
          <span class="token key atrule">run_install</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>


      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Setup Node.js
        <span class="token key atrule">uses</span><span class="token punctuation">:</span> actions/setup<span class="token punctuation">-</span>node@v3
        <span class="token key atrule">with</span><span class="token punctuation">:</span>
          <span class="token key atrule">node-version</span><span class="token punctuation">:</span> <span class="token number">18</span>
          <span class="token key atrule">cache</span><span class="token punctuation">:</span> pnpm


      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Build Docs
        <span class="token key atrule">env</span><span class="token punctuation">:</span>
          <span class="token key atrule">NODE_OPTIONS</span><span class="token punctuation">:</span> <span class="token punctuation">-</span><span class="token punctuation">-</span>max_old_space_size=8192
        <span class="token key atrule">run</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token punctuation">-</span>
          pnpm run docs<span class="token punctuation">:</span>build
          <span class="token punctuation">&gt;</span> src/.vuepress/dist/.nojekyll

      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Deploy Docs
        <span class="token key atrule">uses</span><span class="token punctuation">:</span> JamesIves/github<span class="token punctuation">-</span>pages<span class="token punctuation">-</span>deploy<span class="token punctuation">-</span>action@v4
        <span class="token key atrule">with</span><span class="token punctuation">:</span>
          <span class="token comment"># This is the branch where the docs are deployed to</span>
          <span class="token key atrule">branch</span><span class="token punctuation">:</span> gh<span class="token punctuation">-</span>pages
          <span class="token key atrule">folder</span><span class="token punctuation">:</span> src/.vuepress/dist
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下载完相关依赖后，会提示 <code>Would you like to preview template now? Yes</code> 这里选择 <code>yes</code> 项目就会启动了。当然，也可以使用 <code>pnpm run docs:dev</code> 进行运行。</p><h2 id="_2-1-设置-base" tabindex="-1"><a class="header-anchor" href="#_2-1-设置-base" aria-hidden="true">#</a> 2.1 设置 base</h2><p>src/.vuepress/config.ts</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>将其中的 base: &quot;/&quot;
修改为：
base: &quot;/my-docs/&quot;, # 这里的 my-docs 为后面创建的 Github 仓库的名称
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="_3-github相关配置" tabindex="-1"><a class="header-anchor" href="#_3-github相关配置" aria-hidden="true">#</a> 3. Github相关配置</h1><h2 id="_3-1-创建仓库并关联" tabindex="-1"><a class="header-anchor" href="#_3-1-创建仓库并关联" aria-hidden="true">#</a> 3.1 创建仓库并关联</h2><ol><li>首先在 <code>Github</code> 中创建一个仓库，比如叫：<code>my-docs</code>。（这一步与上一步中的 <code>base</code> 的 <code>val</code> 需要一致）</li><li>配置本地项目与 <code>my-docs</code> 的远程链接</li></ol><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>1. git init 
2. git add src/ .github/ package.json .gitignore pnpm-lock.yaml .git/
3. git commit -m &quot;first&quot;
4. git branch -M main
5. git remote add origin git@github.com:huyangdev/111.git
6. git push -u origin main
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>推送成功之后。</p><h2 id="_3-2-设置-actions-的权限" tabindex="-1"><a class="header-anchor" href="#_3-2-设置-actions-的权限" aria-hidden="true">#</a> 3.2 设置 Actions 的权限</h2><p>项目页面中依次选择：<code>Settings-&gt;Actions-&gt;General-&gt;Workflow permissions</code></p><p>选择其中的 <code>Read and write permissions</code>。这一步时为工作流添加读写权限。</p><h2 id="_3-3-workflows" tabindex="-1"><a class="header-anchor" href="#_3-3-workflows" aria-hidden="true">#</a> 3.3 workflows</h2><p>如果下图中有执行失败的 <code>workflow</code> 。只需要手动从新执行一遍。</p><figure><img src="`+d+'" alt="image-20230320225434885" tabindex="0" loading="lazy"><figcaption>image-20230320225434885</figcaption></figure><p>完成之后应当会出现一个分支 <code>gh-pages</code></p><figure><img src="'+r+'" alt="image-20230320225710341" tabindex="0" loading="lazy"><figcaption>image-20230320225710341</figcaption></figure><h1 id="_4-设置-github-page" tabindex="-1"><a class="header-anchor" href="#_4-设置-github-page" aria-hidden="true">#</a> 4.设置 Github page</h1><figure><img src="'+m+'" alt="image-20230320225820231" tabindex="0" loading="lazy"><figcaption>image-20230320225820231</figcaption></figure><p>访问 <code>https://&lt;username&gt;.github.io/my-docs/</code>。若是 404 可以查看 <code>Actions</code> 中的 <code>workflow</code> 是否出错，从而排查问题。</p>',27);function y(_,f){const e=p("ExternalLinkIcon");return i(),t("div",null,[k,o(" more "),b,n("p",null,[s("使用教程："),n("a",h,[s("Cookbook | vuepress-theme-hope"),c(e)])]),g])}const w=a(v,[["render",y],["__file","deploy_Vuepress.html.vue"]]);export{w as default};
