import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-uJE4P3e0.js";const l={};function p(d,s){return i(),a("div",null,s[0]||(s[0]=[e(`<h1 id="一个主-从模式例子的实现" tabindex="-1"><a class="header-anchor" href="#一个主-从模式例子的实现"><span>⼀个主-从模式例⼦的实现</span></a></h1><p>本节中我们通过zkCli⼯具来实现主-从⽰例的⼀些功能。</p><p>这个例⼦仅⽤于教学⽬的，我们不推荐使⽤zkCli⼯具来搭建系统。使⽤zkCli的⽬的仅仅是为了说明如何通过ZooKeeper来实现协作菜谱，从⽽撇开在实际实现中所需的⼤量细节。我们将在下⼀章中进⼊实现的细节。</p><h2 id="角色" tabindex="-1"><a class="header-anchor" href="#角色"><span>角色</span></a></h2><p>主-从模式的模型中包括三个⾓⾊：</p><ul><li>主节点</li></ul><p>主节点负责监视新的从节点和任务，分配任务给可⽤的从节点。</p><ul><li>从节点</li></ul><p>从节点会通过系统注册⾃⼰，以确保主节点看到它们可以执⾏任务，然后开始监视新任务。</p><ul><li>客户端</li></ul><p>客户端创建新任务并等待系统的响应。</p><h1 id="主节点角色因为" tabindex="-1"><a class="header-anchor" href="#主节点角色因为"><span>主节点⾓⾊因为</span></a></h1><p>只有⼀个进程会成为主节点，所以⼀个进程成为ZooKeeper的主节点后必须锁定管理权。为此，进程需要创建⼀个临时znode，名为/master：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>[zk: localhost:2181(CONNECTED) 0] create -e /master &quot;master1.example.com:2223&quot;①</span></span>
<span class="line"><span>Created /master</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 1] ls /②</span></span>
<span class="line"><span>[master, zookeeper]</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 2] get /master③</span></span>
<span class="line"><span>&quot;master1.example.com:2223&quot;</span></span>
<span class="line"><span>cZxid = 0x67</span></span>
<span class="line"><span>ctime = Tue Dec 11 10:06:19 CET 2012</span></span>
<span class="line"><span>mZxid = 0x67</span></span>
<span class="line"><span>mtime = Tue Dec 11 10:06:19 CET 2012</span></span>
<span class="line"><span>pZxid = 0x67</span></span>
<span class="line"><span>cversion = 0</span></span>
<span class="line"><span>dataVersion = 0</span></span>
<span class="line"><span>aclVersion = 0</span></span>
<span class="line"><span>ephemeralOwner = 0x13b891d4c9e0005</span></span>
<span class="line"><span>dataLength = 26</span></span>
<span class="line"><span>numChildren = 0</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 3]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>①创建主节点的znode，以便获得管理权。使用-e标志来表示创建的znode为临时性的。</p><p>刚刚发⽣了什么？</p><p>⾸先创建⼀个临时znode/master。我们在znode中添加了主机信息，以便ZooKeeper外部的其他进程需要与它通信。添加主机信息并不是必需的，但这样做仅仅是为了说明我们可以在需要时添加数据。</p><p>现在让我们看下我们使⽤两个进程来获得主节点⾓⾊的情况，尽管在任何时刻最多只能有⼀个活动的主节点，其他进程将成为备份主节点。假如其他进程不知道已经有⼀个主节点被选举出来，并尝试创建⼀个/master节点。让我们看看会发⽣什么：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>[zk: localhost:2181(CONNECTED) 0] create -e /master &quot;master2.example.com:2223&quot;</span></span>
<span class="line"><span>Node already exists: /master</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 1]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>ZooKeeper告诉我们⼀个/master节点已经存在。这样，第⼆个进程就知道已经存在⼀个主节点。然⽽，⼀个活动的主节点可能会崩溃，备份主节点需要接替活动主节点的⾓⾊。为了检测到这些，需要在/master节点上设置⼀个监视点，操作如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>[zk: localhost:2181(CONNECTED) 0] create -e /master &quot;master2.example.com:2223&quot;</span></span>
<span class="line"><span>Node already exists: /master</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 1] stat /master true</span></span>
<span class="line"><span>cZxid = 0x67</span></span>
<span class="line"><span>ctime = Tue Dec 11 10:06:19 CET 2012</span></span>
<span class="line"><span>mZxid = 0x67</span></span>
<span class="line"><span>mtime = Tue Dec 11 10:06:19 CET 2012</span></span>
<span class="line"><span>pZxid = 0x67</span></span>
<span class="line"><span>cversion = 0</span></span>
<span class="line"><span>dataVersion = 0</span></span>
<span class="line"><span>aclVersion = 0</span></span>
<span class="line"><span>ephemeralOwner = 0x13b891d4c9e0005</span></span>
<span class="line"><span>dataLength = 26</span></span>
<span class="line"><span>numChildren = 0</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 2]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>stat命令可以得到⼀个znode节点的属性，并允许我们在已经存在的znode节点上设置监视点。通过在路径后⾯设置参数true来添加监视点。当活动的主节点崩溃时，我们会观察到以下情况：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>[zk: localhost:2181(CONNECTED) 0] create -e /master &quot;master2.example.com:2223&quot;</span></span>
<span class="line"><span>Node already exists: /master</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 1] stat /master true</span></span>
<span class="line"><span>cZxid = 0x67</span></span>
<span class="line"><span>ctime = Tue Dec 11 10:06:19 CET 2012</span></span>
<span class="line"><span>mZxid = 0x67</span></span>
<span class="line"><span>mtime = Tue Dec 11 10:06:19 CET 2012</span></span>
<span class="line"><span>pZxid = 0x67</span></span>
<span class="line"><span>cversion = 0</span></span>
<span class="line"><span>dataVersion = 0</span></span>
<span class="line"><span>aclVersion = 0</span></span>
<span class="line"><span>ephemeralOwner = 0x13b891d4c9e0005</span></span>
<span class="line"><span>dataLength = 26</span></span>
<span class="line"><span>numChildren = 0</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 2]</span></span>
<span class="line"><span>WATCHER::</span></span>
<span class="line"><span>WatchedEvent state:SyncConnected type:NodeDeleted path:/master</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 2] ls /</span></span>
<span class="line"><span>[zookeeper]</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 3]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在输出的最后，我们注意到NodeDeleted事件。这个事件指出活动主节点的会话已经关闭或过期。同时注意，/master节点已经不存在了。现在备份主节点通过再次创建/master节点来成为活动主节点。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>[zk: localhost:2181(CONNECTED) 0] create -e /master &quot;master2.example.com:2223&quot;</span></span>
<span class="line"><span>Node already exists: /master</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 1] stat /master true</span></span>
<span class="line"><span>cZxid = 0x67</span></span>
<span class="line"><span>ctime = Tue Dec 11 10:06:19 CET 2012</span></span>
<span class="line"><span>mZxid = 0x67</span></span>
<span class="line"><span>mtime = Tue Dec 11 10:06:19 CET 2012</span></span>
<span class="line"><span>pZxid = 0x67</span></span>
<span class="line"><span>cversion = 0</span></span>
<span class="line"><span>dataVersion = 0</span></span>
<span class="line"><span>aclVersion = 0</span></span>
<span class="line"><span>ephemeralOwner = 0x13b891d4c9e0005</span></span>
<span class="line"><span>dataLength = 26</span></span>
<span class="line"><span>numChildren = 0</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 2]</span></span>
<span class="line"><span>WATCHER::</span></span>
<span class="line"><span>WatchedEvent state:SyncConnected type:NodeDeleted path:/master</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 2] ls /</span></span>
<span class="line"><span>[zookeeper]</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 3] create -e /master &quot;master2.example.com:2223&quot;</span></span>
<span class="line"><span>Created /master</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 4]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>因为备份主节点成功创建了/master节点，所以现在客户端开始成为活动主节点。</p><h1 id="从节点、任务和分配" tabindex="-1"><a class="header-anchor" href="#从节点、任务和分配"><span>从节点、任务和分配</span></a></h1><p>在我们讨论从节点和客户端所采取的步骤之前，让我们先创建三个重要的⽗znode，/workers、/tasks和/assign：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>[zk: localhost:2181(CONNECTED) 0] create /workers &quot;&quot;</span></span>
<span class="line"><span>Created /workers</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 1] create /tasks &quot;&quot;</span></span>
<span class="line"><span>Created /tasks</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 2] create /assign &quot;&quot;</span></span>
<span class="line"><span>Created /assign</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 3] ls /</span></span>
<span class="line"><span>[assign, tasks, workers, master, zookeeper]</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 4]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这三个新的znode为持久性节点，且不包含任何数据。本例中，通过使⽤这些znode可以告诉我们哪个从节点当前有效，还告诉我们当前有任务需要分配，并向从节点分配任务。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>[zk: localhost:2181(CONNECTED) 4] ls /workers true</span></span>
<span class="line"><span>[]</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 5] ls /tasks true</span></span>
<span class="line"><span>[]</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 6]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>请注意，在主节点上调⽤stat命令前，我们使⽤可选的true参数调⽤ls命令。通过true这个参数，可以设置对应znode的⼦节点变化的监视点。</p><h1 id="从节点角色" tabindex="-1"><a class="header-anchor" href="#从节点角色"><span>从节点⾓⾊</span></a></h1><p>从节点⾸先要通知主节点，告知从节点可以执⾏任务。从节点通过在/workers⼦节点下创建临时性的znode来进⾏通知，并在⼦节点中使⽤主机名来标识⾃⼰：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>[zk: localhost:2181(CONNECTED) 0] create -e /workers/worker1.example.com</span></span>
<span class="line"><span>&quot;worker1.example.com:2224&quot;</span></span>
<span class="line"><span>Created /workers/worker1.example.com</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 1]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意，输出中，ZooKeeper确认znode已经创建。之前主节点已经监视了/workers的⼦节点变化情况。⼀旦从节点在/workers下创建了⼀个znode，主节点就会观察到以下通知信息：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>WATCHER::</span></span>
<span class="line"><span>WatchedEvent state:SyncConnected type:NodeChildrenChanged path:/workers</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>下⼀步，从节点需要创建⼀个⽗znode/assing/worker1.example.com来接收任务分配，并通过第⼆个参数为true的ls命令来监视这个节点的变化，以便等待新的任务。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>[zk: localhost:2181(CONNECTED) 0] create -e /workers/worker1.example.com</span></span>
<span class="line"><span>&quot;worker1.example.com:2224&quot;</span></span>
<span class="line"><span>Created /workers/worker1.example.com</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 1] create /assign/worker1.example.com &quot;&quot;Created /assign/worker1.example.com</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 2] ls /assign/worker1.example.com true</span></span>
<span class="line"><span>[]</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 3]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从节点现在已经准备就绪，可以接收任务分配。之后，我们通过讨论客户端⾓⾊来看⼀下任务分配的问题。</p><h1 id="客户端角色" tabindex="-1"><a class="header-anchor" href="#客户端角色"><span>客户端⾓⾊</span></a></h1><p>客户端向系统中添加任务。在本⽰例中具体任务是什么并不重要，我们假设客户端请求主从系统来运⾏cmd命令。为了向系统添加⼀个任务，客户端执⾏以下操作：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>[zk: localhost:2181(CONNECTED) 0] create -s /tasks/task- &quot;cmd&quot;</span></span>
<span class="line"><span>Created /tasks/task-0000000000</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>我们需要按照任务添加的顺序来添加znode，其本质上为⼀个队列。客户端现在必须等待任务执⾏完毕。执⾏任务的从节点将任务执⾏完毕后，会创建⼀个znode来表⽰任务状态。客户端通过查看任务状态的znode是否创建来确定任务是否执⾏完毕，因此客户端需要监视状态znode的创建事件：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>[zk: localhost:2181(CONNECTED) 1] ls /tasks/task-0000000000 true</span></span>
<span class="line"><span>[]</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 2]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>执⾏任务的从节点会在/tasks/task-0000000000节点下创建状态znode节点，所以我们需要⽤ls命令来监视/tasks/task-0000000000的⼦节点。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>[zk: localhost:2181(CONNECTED) 6]</span></span>
<span class="line"><span>WATCHER::</span></span>
<span class="line"><span>WatchedEvent state:SyncConnected type:NodeChildrenChanged path:/tasks</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>主节点之后会检查这个新的任务，获取可⽤的从节点列表，<a href="http://xn--worker1-q33krjv4d18phzbq4he93qbk5bb4e.example.com" target="_blank" rel="noopener noreferrer">之后分配这个任务给worker1.example.com</a>：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>[zk: 6] ls /tasks</span></span>
<span class="line"><span>[task-0000000000]</span></span>
<span class="line"><span>[zk: 7] ls /workers</span></span>
<span class="line"><span>[worker1.example.com]</span></span>
<span class="line"><span>[zk: 8] create /assign/worker1.example.com/task-0000000000 &quot;&quot;</span></span>
<span class="line"><span>Created /assign/worker1.example.com/task-0000000000</span></span>
<span class="line"><span>[zk: 9]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从节点接收到新任务分配的通知：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>[zk: localhost:2181(CONNECTED) 3]</span></span>
<span class="line"><span>WATCHER::</span></span>
<span class="line"><span>WatchedEvent state:SyncConnected type:NodeChildrenChanged</span></span>
<span class="line"><span>path:/assign/worker1.example.com</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从节点之后便开始检查新任务，并确认该任务是否分配给⾃⼰：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>WATCHER::</span></span>
<span class="line"><span>WatchedEvent state:SyncConnected type:NodeChildrenChanged</span></span>
<span class="line"><span>path:/assign/worker1.example.com</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 3] ls /assign/worker1.example.com</span></span>
<span class="line"><span>[task-0000000000]</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 4]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>⼀旦从节点完成任务的执⾏，它就会在/tasks中添加⼀个状态znode：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>[zk: localhost:2181(CONNECTED) 4] create /tasks/task-0000000000/status &quot;done&quot;</span></span>
<span class="line"><span>Created /tasks/task-0000000000/status</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 5]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>之后，客户端接收到通知，并检查执⾏结果：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>WATCHER::</span></span>
<span class="line"><span>WatchedEvent state:SyncConnected type:NodeChildrenChanged</span></span>
<span class="line"><span>path:/tasks/task-0000000000</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 2] get /tasks/task-0000000000</span></span>
<span class="line"><span>&quot;cmd&quot;</span></span>
<span class="line"><span>cZxid = 0x7c</span></span>
<span class="line"><span>ctime = Tue Dec 11 10:30:18 CET 2012</span></span>
<span class="line"><span>mZxid = 0x7c</span></span>
<span class="line"><span>mtime = Tue Dec 11 10:30:18 CET 2012</span></span>
<span class="line"><span>pZxid = 0x7e</span></span>
<span class="line"><span>cversion = 1</span></span>
<span class="line"><span>dataVersion = 0</span></span>
<span class="line"><span>aclVersion = 0</span></span>
<span class="line"><span>ephemeralOwner = 0x0</span></span>
<span class="line"><span>dataLength = 5</span></span>
<span class="line"><span>numChildren = 1</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 3] get /tasks/task-0000000000/status</span></span>
<span class="line"><span>&quot;done&quot;</span></span>
<span class="line"><span>cZxid = 0x7e</span></span>
<span class="line"><span>ctime = Tue Dec 11 10:42:41 CET 2012</span></span>
<span class="line"><span>mZxid = 0x7e</span></span>
<span class="line"><span>mtime = Tue Dec 11 10:42:41 CET 2012</span></span>
<span class="line"><span>pZxid = 0x7e</span></span>
<span class="line"><span>cversion = 0</span></span>
<span class="line"><span>dataVersion = 0</span></span>
<span class="line"><span>aclVersion = 0</span></span>
<span class="line"><span>ephemeralOwner = 0x0</span></span>
<span class="line"><span>dataLength = 8</span></span>
<span class="line"><span>numChildren = 0</span></span>
<span class="line"><span>[zk: localhost:2181(CONNECTED) 4]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>客户端检查状态znode的信息，并确认任务的执⾏结果。本例中，我们看到任务成功执⾏，其状态为“done”。当然任务也可能⾮常复杂，甚⾄涉及另⼀个分布式系统。最终不管是什么样的任务，执⾏任务的机制与通过ZooKeeper来传递结果，本质上都是⼀样的</p><h1 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h1><p>《Zookeeper分布式过程协同技术详解》</p>`,60)]))}const t=n(l,[["render",p]]),o=JSON.parse('{"path":"/posts/zookeeper/2016-09-25-zookeeper-18-master-slave.html","title":"ZooKeeper-18-⼀个主-从模式例⼦的实现","lang":"zh-CN","frontmatter":{"title":"ZooKeeper-18-⼀个主-从模式例⼦的实现","date":"2016-09-25T00:00:00.000Z","categories":["Apache"],"tags":["zookeeper","config-center"],"published":true,"description":"⼀个主-从模式例⼦的实现 本节中我们通过zkCli⼯具来实现主-从⽰例的⼀些功能。 这个例⼦仅⽤于教学⽬的，我们不推荐使⽤zkCli⼯具来搭建系统。使⽤zkCli的⽬的仅仅是为了说明如何通过ZooKeeper来实现协作菜谱，从⽽撇开在实际实现中所需的⼤量细节。我们将在下⼀章中进⼊实现的细节。 角色 主-从模式的模型中包括三个⾓⾊： 主节点 主节点负责监...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/blog-backend/posts/zookeeper/2016-09-25-zookeeper-18-master-slave.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"ZooKeeper-18-⼀个主-从模式例⼦的实现"}],["meta",{"property":"og:description","content":"⼀个主-从模式例⼦的实现 本节中我们通过zkCli⼯具来实现主-从⽰例的⼀些功能。 这个例⼦仅⽤于教学⽬的，我们不推荐使⽤zkCli⼯具来搭建系统。使⽤zkCli的⽬的仅仅是为了说明如何通过ZooKeeper来实现协作菜谱，从⽽撇开在实际实现中所需的⼤量细节。我们将在下⼀章中进⼊实现的细节。 角色 主-从模式的模型中包括三个⾓⾊： 主节点 主节点负责监..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-08-22T03:45:14.000Z"}],["meta",{"property":"article:tag","content":"zookeeper"}],["meta",{"property":"article:tag","content":"config-center"}],["meta",{"property":"article:published_time","content":"2016-09-25T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2025-08-22T03:45:14.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"ZooKeeper-18-⼀个主-从模式例⼦的实现\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2016-09-25T00:00:00.000Z\\",\\"dateModified\\":\\"2025-08-22T03:45:14.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1755834314000,"updatedTime":1755834314000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":1}]},"readingTime":{"minutes":7.3,"words":2190},"filePathRelative":"posts/zookeeper/2016-09-25-zookeeper-18-master-slave.md","localizedDate":"2016年9月25日","excerpt":"\\n<p>本节中我们通过zkCli⼯具来实现主-从⽰例的⼀些功能。</p>\\n<p>这个例⼦仅⽤于教学⽬的，我们不推荐使⽤zkCli⼯具来搭建系统。使⽤zkCli的⽬的仅仅是为了说明如何通过ZooKeeper来实现协作菜谱，从⽽撇开在实际实现中所需的⼤量细节。我们将在下⼀章中进⼊实现的细节。</p>\\n<h2>角色</h2>\\n<p>主-从模式的模型中包括三个⾓⾊：</p>\\n<ul>\\n<li>主节点</li>\\n</ul>\\n<p>主节点负责监视新的从节点和任务，分配任务给可⽤的从节点。</p>\\n<ul>\\n<li>从节点</li>\\n</ul>\\n<p>从节点会通过系统注册⾃⼰，以确保主节点看到它们可以执⾏任务，然后开始监视新任务。</p>","autoDesc":true}');export{t as comp,o as data};
