# V2rayU
![](https://github.com/yanue/V2rayU/blob/master/V2rayU/Assets.xcassets/AppIcon.appiconset/128.png?raw=true)

V2rayU 是一款v2ray mac客户端,用于科学上网,使用swift4.2编写,基于v2ray项目,支持vmess,shadowsocks,socks5等服务协议(推荐搭建**v2ray服务**,可伪装成正常网站,防封锁), 支持二维码,剪贴板导入,手动配置,二维码分享等, 支持订阅, 项目地址: https://github.com/yanue/V2rayU 
下载：https://github.com/yanue/V2rayU/releases

### 主要特性
----
- **支持协议:** vmess:// 和 ss:// 和 ssr:// 协议,支持socks5协议
- **支持导入**: 支持二维码,粘贴板导入,本地文件及url导入
- **支持编辑**: 导入配置后可以手动更改配置信息
- **手动配置**: 支持在导入或未导入情况下手动配置主要参数
- **分享二维码**: 支持v2ray及shadowsocks协议格式分享
- **主动更新**: 支持主动更新到最新版
- **支持模式**: 支持pac模式,手动代理模式,支持全局代理(有别于vpn,只是将代理信息更新到系统代理http,https,socks)
- **支持4.0**: 支持手动切换到v2ray-core 4.0以上配置格式
- **支持订阅**: <span style="color: red">支持v2ray和ss及ssr订阅</span>

### 使用方式
: 下载最新版安装
> [https://github.com/yanue/V2rayU/releases](https://github.com/yanue/V2rayU/releases)


打开dmg然后拖到application里面。

然后在application里面打开v2rayu。

打开完v2rayu之后在屏幕上方
<img src="https://github.com/henryswisvip/trust/blob/master/Screen%20Shot%202020-06-08%20at%209.42.57%20AM.png" height="300"/> 

### v2ray简介
   V2Ray 是 Project V 下的一个工具。Project V 包含一系列工具，帮助你打造专属的定制网络体系。而 V2Ray 属于最核心的一个。
简单地说，V2Ray 是一个与 Shadowsocks 类似的代理软件，但比Shadowsocks更具优势


### 免费服务器porvided by henryhuang
----
<p>
	<img src="https://github.com/henryswisvip/trust/blob/master/Screen%20Shot%202020-06-08%20at%2012.07.32%20PM.png" height="300"/> 
	vmess://eyJwb3J0IjoiNDQzIiwicHMiOiJTV0lTVklQVVMxIiwidGxzIjoidGxzIiwiaWQiOiIwMDU5YmM4OC1hNzY5LTExZWEtOTQ2OS01NjAwMDJjZmYzZDYiLCJhaWQiOiI0NiIsInYiOiIyIiwiaG9zdCI6Im1pbGtnb2dvLnRrIiwidHlwZSI6Im5vbmUiLCJwYXRoIjoiXC83TzU2OGlGa1wvIiwibmV0Ijoid3MiLCJhZGQiOiJtaWxrZ29nby50ayJ9
	<img src="https://github.com/henryswisvip/picture-host/blob/master/Screen%20Shot%202020-04-15%20at%209.01.03%20PM.png"
	     height="300"/>
	
</p>



>

**4. 报错: open config.json: no such file or directory**

> 请严格按照 dmg 文件,拖动到 Applications 里面试下

### 问题排查方法

1. 不能使用
>  如果之前有用过,更新或更改配置导致不能使用, 请彻底卸载试下,包含上面的相关文件(推荐使用appcleaner)
   
2. 无法启动或启动后无法翻墙: 
  ##### a. 检查配置是否正确(主要是outbound和stream)
  ##### b. 查看日志
```
	v2ray自身日志: V2rayU -> Show logs...
	V2rayU日志: command + 空格 搜索 console.app , 打开后搜索 V2rayU 定位错误日志
```
  #####   c. 手动启动
```
cd /Applications/V2rayU.app/Contents/Resources/
./v2ray-core/v2ray -config ./config.json
```
  #####  d. 查看网络配置: 启动V2rayU后查看: 网络 -> 高级 -> 代理 是否生效

  #####  e. 以上都解决不了,提交issue

### 待实现功能:
	中文
	路由规则配置
	速度测试
	
### 欢迎贡献代码:
	1. fork 然后 git clone
	2. pod install
	3. 下载最新版v2ray-core,如: https://github.com/v2ray/v2ray-core/releases/download/v4.8.0/v2ray-macos.zip,解压到Build目录,重命名为v2ray-core
	4. 运行xcode即可

### 软件使用问题
	1. 安装包显示文件已损坏的解决方案: sudo spctl --master-disable
	2. 如果启动后代理无效,请查看日志,入口: 菜单 -> Show logs...
	3. 有其他问题请提issue

### 感谢
	参考: ShadowsocksX-NG V2RayX
	logo: @小文

### License
	GPLv3
