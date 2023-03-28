import{_ as p,W as e,X as c,Y as n,Z as s,$ as o,a1 as a,C as l}from"./framework-b5ea9e64.js";const i="/my-docs/assets/1550387-20190117192604685-1528551798-eede36dc.png",u="/my-docs/assets/1550387-20190117195628546-110897453-e57d609c.png",k={},r=a(`<h1 id="java代理模式" tabindex="-1"><a class="header-anchor" href="#java代理模式" aria-hidden="true">#</a> java代理模式</h1><h2 id="jdk自带的动态代理" tabindex="-1"><a class="header-anchor" href="#jdk自带的动态代理" aria-hidden="true">#</a> JDK自带的动态代理</h2><p>就 Java 来说，动态代理的实现方式有很多种，比如 <strong>JDK 动态代理</strong>、<strong>CGLIB 动态代理</strong>等等。</p><p><strong>JDK 动态代理有一个最致命的问题是其只能代理实现了接口的类</strong>。因为通过JDK Proxy 方法创建的代理对象都会继承 Proxy 类，通过继承 Proxy 类将 <code>InvocationHandler</code> 与代理对象进行绑定。之后在通过实现代理服务的接口完成对目标对象的增强。</p><h2 id="cglib-动态代理" tabindex="-1"><a class="header-anchor" href="#cglib-动态代理" aria-hidden="true">#</a> CGLIB 动态代理</h2><ul><li>代理类是被代理类的子类。</li><li>使用 FastClass 调用方法</li></ul><h2 id="cglib-invoke以及invokesuper的一点区别" tabindex="-1"><a class="header-anchor" href="#cglib-invoke以及invokesuper的一点区别" aria-hidden="true">#</a> Cglib invoke以及invokeSuper的一点区别</h2><p>有这样一个问题：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * <span class="token keyword">@param</span> <span class="token parameter">o</span>           通过cglib动态生成的被代理对象的子类对象。也就是代理对象
 * <span class="token keyword">@param</span> <span class="token parameter">method</span>      被拦截的方法（需要增强的方法）
 * <span class="token keyword">@param</span> <span class="token parameter">args</span>        方法入参
 * <span class="token keyword">@param</span> <span class="token parameter">methodProxy</span> 用于调用原始方法
 */</span>
<span class="token annotation punctuation">@Override</span>
<span class="token keyword">public</span> <span class="token class-name">Object</span> <span class="token function">intercept</span><span class="token punctuation">(</span><span class="token class-name">Object</span> o<span class="token punctuation">,</span> <span class="token class-name">Method</span> method<span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">,</span> <span class="token class-name">MethodProxy</span> methodProxy<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Throwable</span> <span class="token punctuation">{</span>
    <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">format</span><span class="token punctuation">(</span><span class="token string">&quot;方法 %s 调用前....\\n&quot;</span><span class="token punctuation">,</span>method<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">Object</span> obj <span class="token operator">=</span> methodProxy<span class="token punctuation">.</span><span class="token function">invokeSuper</span><span class="token punctuation">(</span>o<span class="token punctuation">,</span>args<span class="token punctuation">)</span><span class="token punctuation">;</span>   <span class="token comment">// flag01</span>
    <span class="token comment">// Object obj = methodProxy.invoke(o,args);     // flag02</span>
    <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">format</span><span class="token punctuation">(</span><span class="token string">&quot;方法 %s 调用后....\\n&quot;</span><span class="token punctuation">,</span>method<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> obj<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述方法是 <code>TestMethodInterceptor</code>中的 <code>invoke</code> 方法。当调用 invokeSuper 时程序正常运行。但是如果执行 invoke 这会导致栈溢出。这是为什么？</p><p>简单记录下，解决的一个问题，Cglib的invoke和invokeSuper的区别：</p>`,11),d={href:"https://www.cnblogs.com/lvbinbin2yujie/p/10284316.html",target:"_blank",rel:"noopener noreferrer"},v=a(`<p>简而言之，<strong>invoke方法调用的对象没有增强过，invokeSuper方法调用的对象已经是增强了的，所以会再走一遍 MyMethodInterceptor的 interceptor方法，如果是个拦截器链条，就会重新在走一次拦截器链；</strong></p><p>代码准备：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Target</span> <span class="token punctuation">{</span>
    
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">a</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot; a 方法&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">b</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot; b 方法&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>lang<span class="token punctuation">.</span>reflect<span class="token punctuation">.</span></span><span class="token class-name">Method</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">net<span class="token punctuation">.</span>sf<span class="token punctuation">.</span>cglib<span class="token punctuation">.</span>proxy<span class="token punctuation">.</span></span><span class="token class-name">MethodInterceptor</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">net<span class="token punctuation">.</span>sf<span class="token punctuation">.</span>cglib<span class="token punctuation">.</span>proxy<span class="token punctuation">.</span></span><span class="token class-name">MethodProxy</span></span><span class="token punctuation">;</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">MyMethodInterceptor</span> <span class="token keyword">implements</span> <span class="token class-name">MethodInterceptor</span><span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token class-name">Object</span> <span class="token function">intercept</span><span class="token punctuation">(</span><span class="token class-name">Object</span> obj<span class="token punctuation">,</span> <span class="token class-name">Method</span> method<span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">,</span> <span class="token class-name">MethodProxy</span> proxy<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Throwable</span> <span class="token punctuation">{</span>
　　　　<span class="token comment">//obj是代理后的子类  ，method是调用方法 ，args是方法入参 ， proxy是MethodProxy代理对象</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;myMethodInterceptor go &quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Object</span> res <span class="token operator">=</span> proxy<span class="token punctuation">.</span><span class="token function">invokeSuper</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span> args<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> res<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试类：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">TestApp</span> <span class="token punctuation">{</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Enhancer</span> e <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Enhancer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        e<span class="token punctuation">.</span><span class="token function">setSuperclass</span><span class="token punctuation">(</span><span class="token class-name">Target</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span>     
        e<span class="token punctuation">.</span><span class="token function">setCallback</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">MyMethodInterceptor</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Target</span> t<span class="token operator">=</span><span class="token punctuation">(</span><span class="token class-name">Target</span><span class="token punctuation">)</span> e<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        t<span class="token punctuation">.</span><span class="token function">a</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出结果：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>myMethodInterceptor go 
 a 方法
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>先解决一个疑惑，Target 这个类里面方法写 this 就是指 Cglib 生成的代理类——被代理类的子类 ，</p><p>测试在 a 方法中添加一句输出 this ，结论：Cglib代理的时候 target 对象中的 this 就是Cglib 生成的代理类 （你可能觉得我说的是废话，子类对象在父类的this指的不是自身吗？ 你知道 Spring Aop 里 this 方法无法<strong>增强自身调用</strong>，这时候你就开始怀疑人生了）</p><figure><img src="`+i+`" alt="增强自身调用" tabindex="0" loading="lazy"><figcaption>增强自身调用</figcaption></figure><p>既然知道了this对象就是指代的自身，那我比如 this.b() 或者 b() 应该也被回调一次了 。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Target</span> <span class="token punctuation">{</span>
    
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">a</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot; a 方法&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token function">b</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">b</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot; b 方法&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其他类不改动代码，测试结果如下： 果然 <code>this.b()</code> 方法也被增强了；</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>myMethodInterceptor go 
 a 方法
myMethodInterceptor go 
 b 方法
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>你在 b() 打个断点，下一步就跳进入 MyMethodInterceptor 的 intercept 方法里了 ；这个似乎也没有毛病，<strong>其实原因就是 invokeSuper；invokeSuper传入的参数是Cglib代理的子类 ，就相当于 调用 Target$$EnhanceredByCGLIB 这个子类的b()方法，肯定会再次进入回调；</strong></p><p>如何实现像AOP一样 调用自身无法增强呢？</p><p>修改代码如下： 改动的地方做了标记 ：）</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Target</span> <span class="token punctuation">{</span>
    
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">a</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot; a 方法&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token function">b</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">b</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot; b 方法&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>


<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">MyMethodInterceptor</span> <span class="token keyword">implements</span> <span class="token class-name">MethodInterceptor</span><span class="token punctuation">{</span>
    <span class="token comment">// -----------修改</span>
    <span class="token keyword">private</span> <span class="token class-name">Object</span> target<span class="token punctuation">;</span>
    
    <span class="token keyword">public</span> <span class="token class-name">MyMethodInterceptor</span><span class="token punctuation">(</span><span class="token class-name">Object</span> target<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">super</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>target <span class="token operator">=</span> target<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// -----------修改</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token class-name">Object</span> <span class="token function">intercept</span><span class="token punctuation">(</span><span class="token class-name">Object</span> obj<span class="token punctuation">,</span> <span class="token class-name">Method</span> method<span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">,</span> <span class="token class-name">MethodProxy</span> proxy<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Throwable</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;myMethodInterceptor go &quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// -----------修改</span>
        <span class="token class-name">Object</span> res <span class="token operator">=</span> proxy<span class="token punctuation">.</span><span class="token function">invokeSuper</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span> args<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">//Object res = proxy.invoke(target, args);</span>
        <span class="token comment">// -----------修改</span>
        
        <span class="token keyword">return</span> res<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

<span class="token punctuation">}</span>

<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">TestApp</span> <span class="token punctuation">{</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
<span class="token comment">//        System.setProperty(DebuggingClassWriter.DEBUG_LOCATION_PROPERTY, &quot;E:\\\\api&quot;);</span>
        <span class="token class-name">Target</span> target <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Target</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>    <span class="token comment">// -----------修改</span>
        <span class="token class-name">Enhancer</span> e <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Enhancer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        e<span class="token punctuation">.</span><span class="token function">setSuperclass</span><span class="token punctuation">(</span><span class="token class-name">Target</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        e<span class="token punctuation">.</span><span class="token function">setCallback</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">MyMethodInterceptor</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>   <span class="token comment">// -----------修改</span>
        <span class="token class-name">Target</span> t<span class="token operator">=</span><span class="token punctuation">(</span><span class="token class-name">Target</span><span class="token punctuation">)</span> e<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        t<span class="token punctuation">.</span><span class="token function">a</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试结果如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>myMethodInterceptor go 
 a 方法
 b 方法
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这就和AOP的功能一毛一样了吧 ； <strong>区别就在于 invoke 和 invokeSuper ： 在我理解看来，invoke方法调用的对象没有增强过，invokeSuper方法调用的对象已经是增强了的，所以会再走一遍 MyMethodInterceptor的 interceptor方法，如果是个拦截器链条，就会重新在走一次拦截器链；</strong></p><h2 id="查看cglib生成子类的方案思路" tabindex="-1"><a class="header-anchor" href="#查看cglib生成子类的方案思路" aria-hidden="true">#</a> 查看Cglib生成子类的方案思路</h2><p>测试类上加上这样一句话：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">TestApp</span> <span class="token punctuation">{</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">setProperty</span><span class="token punctuation">(</span><span class="token class-name">DebuggingClassWriter</span><span class="token punctuation">.</span><span class="token constant">DEBUG_LOCATION_PROPERTY</span><span class="token punctuation">,</span> <span class="token string">&quot;E:\\\\api&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  \\\\ 输出代理类
        <span class="token class-name">Target</span> target <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Target</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Enhancer</span> e <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Enhancer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        e<span class="token punctuation">.</span><span class="token function">setSuperclass</span><span class="token punctuation">(</span><span class="token class-name">Target</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        e<span class="token punctuation">.</span><span class="token function">setCallback</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">MyMethodInterceptor</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Target</span> t<span class="token operator">=</span><span class="token punctuation">(</span><span class="token class-name">Target</span><span class="token punctuation">)</span> e<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        t<span class="token punctuation">.</span><span class="token function">a</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到确实生成了CGLIB子类class文件；</p><p>第一个文件：<strong>代理类</strong>的<strong>FastClass类</strong></p><p>第二个文件：<strong>代理类</strong>，继承自被代理类</p><p>第三个文件：被代理类的 <strong>FastClass 类</strong></p><figure><img src="`+u+'" alt="生成的class文件" tabindex="0" loading="lazy"><figcaption>生成的class文件</figcaption></figure>',29);function m(b,g){const t=l("ExternalLinkIcon");return e(),c("div",null,[r,n("p",null,[s("参考："),n("a",d,[s("https://www.cnblogs.com/lvbinbin2yujie/p/10284316.html"),o(t)])]),v])}const h=p(k,[["render",m],["__file","Java_basic.html.vue"]]);export{h as default};
