# 一些前言：

    版本控制除了git其实还有SVN等，但是git比较流行。
    SVN是集中式版本控制系统（所有信息在服务器，单点故障隐患），而git是分布式版本控制系统（用户有全部信息，安全隐患）。
    先说操作再补充一下理论知识。


# 一、IDEA中操作git（重要）：

本地编辑了一些文件，下一步想要提交，首先需要更新（pull），然后再提交（push），避免覆盖。
pull并不会覆盖本地修改的文件，会将远程仓库的更新合并到本地。
pull和push在左下角的git插件中右键当前分支就有显示。

## 1.pull操作

首先说pull，点击左上角版本控制，点击更新，就完成了pull操作。  
但这里出现两个选项，说一下他们的区别：  
将传入更改合并到当前分支：  
实际上是 git pull --merge，会将远程分支的更新合并到当前分支，如果有冲突需要手动解决  
在传入更改上变基当前分支：  
实际上是 git pull --rebase，会将本地的提交放到远程分支的更新之后，形成一条线性的提交历史

例如：
```    
    远程分支历史：A---B---C   (origin/main)
    本地分支历史：A---B---D   (main)
    如果是merge：
        A---B---C
             \   \
              D---M   (main)
    如果是rebase：
        A---B---C---D'   (main)
```
如果本地修改的文件和远程仓库的更新有冲突，rebase会暂停并提示解决冲突，解决后需要使用git rebase --continue。

如果希望保持提交历史的线性，可以选择rebase；如果希望保留分支的合并历史，可以选择merge。

## 2.push操作

一般的项目开发中，一般自己先开一个自己的分支，用作测试，等自己开发完成后，再合并到主分支。如果直接在生产环境的主分支上开发，bug了怎么办呢？

```
具体步骤：
    a. idea左下角的git插件中，右击main有一个新建分支，比如新建分支"myFirstBranch"
    b. 然后右击该分支，选择 签出 把工作区切换到该分支
    （这样下一次push才会push到这一分支，假如工作区还在main，那改的还是main！）
    c. 不断地开发，push，这一分支没bug了就可以合并到main了：切换工作区到main以后，右键自己的分支，选择合并
    d. 合并以后右键main，选择push推送。
```
```
当开发自己分支时，如遇他人修改，此时的更新操作：
    a. 左上角的版本控制点击更新项目，
    b. git插件中右键主分支，点击更新，现在主分支更新到最新了
    c. 切换工作区到自己的分支，
    d. 右键主分支，选择合并到当前分支，即可完成更新。
```

merge时如果冲突了怎么办？
```
1. Git会标记冲突的文件，使用<<<<<<<、=======、>>>>>>>标记冲突区域
2. 手动编辑这些文件，解决冲突
3. 使用git add将解决冲突后的文件添加到暂存区
4. 使用git commit完成合并提交
```
比如：
```
    <<<<< HEAD
    内容A
    =======
    内容B
    >>>>>> branch-name
    表示内容A是当前分支的内容，内容B是要合并进来的分支的内容。
```
修改时删除标记符号，保留想要的内容以后再add和commit。


# 二、一些基本理论：
```
Git有四个工作区域：
        ---------------------------
       |工作目录（Working Directory）|                平时存放项目代码的地方
        ---------------------------
        |                       ↑
    git add files           git checkout
        ↓                       |
        -------------------------
        |   暂存区(Stage/Index)  |                   用于保存即将提交的文件列表信息
        -------------------------
        |                       ↑
    git commit              git reset
        ↓                       |
        -------------------------
        |   本地仓库(History)    |                   HEAD所指向的仓库。是安全存放数据的位置，这里面有提交的所有版本的数据
        -------------------------
        |                       ↑
    git push                git pull
        ↓                       |
        --------------------------
       |远程仓库(Remote Repository)|                 托管代码的服务器
        --------------------------

* HEAD：指向当前分支的最新提交记录。
```
git管理的文件状态：
* 未跟踪（untracked）
* 未修改（unmodified）
* 已修改（modified）
* 已暂存（staged）
* 已提交(committed)

.gitignore文件：该文件用于忽略上传，可以使用通配符。

名称的前面有 / 表示忽略该目录下的文件或文件夹，后面有 / 表示忽略该目录及其下所有内容。  
比如/temp表示忽略当前目录下的temp文件夹，而temp/表示忽略所有temp文件夹。

    通常java项目忽略 .idea目录，所有的class文件，日志文件，锁文件，target目录等等：
        .idea/
        *.class
        *.log
        *.lock
        target/


# 三、一些更加细节的理论
```
a. 当 git init时，发生了什么？  
    1. 创建了一个名为 .git 的隐藏目录  
    2. 在 .git 目录下创建了一些子目录和文件，比如config、HEAD等  
    3. 初始化了main分支  
    4. 创建了一个空的暂存区（Index）  
* 当前.git的config内容是本地配置(比如用户名、用户邮箱)，全局配置在用户目录下的gitconfig文件中。  
* commit的时候优先用本地配置。


b. git add 时，发生了什么？  
    1. 将工作区中要add的文件的当前状态复制到暂存区  
    2. 创建一个新的blob对象在 .git/objects 目录下，存储 文件内容、类型 ，以SHA-1哈希值命名（比如1c/bfc3...十六进制)，
       根据blob可以找到文件内容（命令 git cat-file -p <sha1>）。  
        如果两个文件完全一样，对应的blob对象也是一样的。  
        sha1哈希值是怎么计算的？ ---实际计算的是 "blob len\0文件内容" 的SHA-1哈希值，len是文件内容的字节长度。  
            Hash算法通过散列算法将任意长度的输入转换为固定长度的输出，hash过程不可逆。  
            常见的有MD5 (128bit)、SHA-1 (160bit)、SHA-256 (256bit)。前两种不安全，已被破解。  
    3. 那么文件名信息存储在哪里呢？在.git/index索引中。可以用git ls-files -s查看索引内容。  
       索引中存储了：文件权限 + blob对象 + + 文件名。  
* 在修改文件时，会创建新的blob，而旧的blob也会存在，所以git可以保存文件的历史版本。


b. git commit 时，发生了什么？
    1. commit后会返回一个哈希值，可知他生成了一个 commit对象 ，依旧存储在 .git/objects
        查看这个哈希值，包含tree、作者信息、时间戳、父commit 对象。
            继续查看tree对象，内容是 这次commit的文件的 索引。
    2. 在.git/refs/heads/目录下生成head引用，内容是这次的commit 对象。
        关于HEAD：.git/HEAD文件指向当前分支最新commit的引用，
                比如 HEAD打开以后看到指向 refs/heads/main，再打开 refs/heads/main看到最新commit的哈希值。
    3. 在.git/logs/refs/heads/目录下生成日志文件，记录了每次commit的历史。
        可以用git reflog查看这些日志，包含每次commit的哈希值、作者信息、时间戳以及操作类型（commit、merge等）。
* 如果commit包含了文件夹，那么这次commit生成的tree 会包含另一个tree，存储新文件夹下文件的索引（文件名 + 对应的blob对象）。

示意图：
    commit1 对象←-parent--commit2 对象 ←-parent--commit3 对象
        ↓                   ↓                        ↓
    tree1 对象           tree2 对象               tree3 对象 → file1/file2Modified
        |                   |                       ↓
    -----------         -----------               子tree
    ↓         ↓         |         ↓                 ↓
  file1     file2       |     file2Modified      file3(blob)
  (blob)    (blob)      |         (blob)
    ↑--------------------    


c. git push 时，发生了什么？
    1. 将本地仓库中的commit对象发送到远程仓库
    2. 更新远程仓库的引用（refs），使其指向最新的提交对象
    3. 远程仓库接收并存储这些提交对象


d. 什么是hook？
    Git hooks是一些脚本，可以在Git特定事件发生时自动执行。
    这些脚本存放在.git/hooks目录下，默认有一些示例脚本，可以根据需要启用或编写自己的脚本。
    常见的钩子包括：
        pre-commit：在提交之前运行，可以用于代码检查、格式化等
        post-commit：在提交之后运行，可以用于发送通知、更新文档等
        pre-push：在推送之前运行，可以用于运行测试、验证代码等


e. 什么是logs？
    Git logs记录了对引用（refs）的更改历史。
    这些日志存放在.git/logs目录下，可以通过git reflog命令查看。
    reflog记录了每次对HEAD的更改，包括commit、checkout、merge等操作。
    通过reflog可以找回丢失的提交，查看历史操作等。
```



# 四、Linux下git的常用命令
```
1. git init：初始化一个新的Git仓库
2. git clone <repository>：克隆一个远程仓库到本地
3. git status：查看当前工作区和暂存区的状态
4. git add <file>：将文件添加到暂存区
5. git commit -m "message"：提交暂存区的更改到本地仓库
6. git pull：从远程仓库拉取最新的更改并合并到当前分支
7. git push：将本地仓库的更改推送到远程仓库
8. git branch：列出所有分支；创建新分支：git branch <branch>；
    强制删除分支：git branch -D <branch>；如果--delete，则会检查分支是否已合并，未合并则报错
9. git checkout <branch>：切换到指定分支
10. git merge <branch>：将指定分支合并到当前分支

11. git cat-file -p <sha1>：查看指定对象的内容；git cat-file -t <sha1>：查看对象类型
12. git ls-files -s：查看索引中的文件信息
```