# git 命令

``` text
    相关链接：
    Mac下如何把本地项目上传到git上：https://liuyanzhao.com/6319.html
    hot fix:https://blog.csdn.net/hherima/article/details/50386011#commentBox

    本地项目放到远程上
    git init
    git add .
    git commit -m 'first commit'
    git remote add origin 'https://github.com/yourname/project.git'（这是HTTP链接，搞了SSH免密登录的可以使用SSH链接）
    git push -u origin main（这样就是上传项目到你的main主分支）
    ————————————————

    git status  查看文件处于什么状态
    echo myProject > README 在myProject文件下建立一个README文件
    git init. 建立一个本地仓库
    git add file 'filename'，将文件添加进缓存区(Stage) 此时用git status查看，状态是‘Changes to be committed’+ 'modified:文件名 '表示有改动的是那个文件
    git add .    将所有更改文件添加进缓存区
    git commit -m 'message'   将所有当前缓存区的内容一起提交到当前分支本地仓库 如果需要更新到远程仓库还需要push
    git commit -a -m 'message' 或者 git commit -am 'message' 相当于将add和commit两步结合啦：将本地所有修改文件提交到缓存区并提交
    git diff 查看修改内容
    git diff HEAD -- readme.txt 用来查看当前工作区与版本库里readme.txt文件最新版本的区别 HEAD指当前工作区分支
    git log 各次提交的记录 显示各次提交时的message注解 加上 --pretty=oneline 参数，会简短的每行输出一条 每一次的记录前面都有一串很长的commit——ID用来每一次提交的版本

    git log --stat 能查看每次提交的文件
    git reset --hard HEAD^ 返回上一个版本 HEAD表示当前分支的当前的版本，每多一个^表示之前的一个版本 所以HEAD^^就是上上个版本
    或者 git reset --hard commit_id 直接回到某个版本号(版本号很长，不用写全，大概写个前几位，git会自动去找的)。当返回上一版，再git log时，会发现打印不出刚才的最新版了，此时就可以通过这第二种使用版本号的方法，重新回退到那个版本（前提是还没有关闭终端，能找到commit_id）但是要谨慎使用 否则原来的代码不好找回
    git push -f 或者 git push --force 将回退后的版本强制更新上传
    git push Nest-demo HEAD:main 比如本地叫 master, push stream 的远程端叫 main 了，此时用push 就会提示需要改个名
    git reset HEAD file 将放进缓存区的文件撤销掉(unstage)，重新放回工作区. 此时执行过后，会提示‘Unstaged changes after reset’+文件名,此时再git status查看状态，会提示‘changes not staged for commit’,接下来的操作可以重新add或者把工作区的也撤销git checkout -- file
    git reflog 记录曾经输入过的命令 （这样即使关闭了终端，之前的commit_id也能找回来）
    git checkout -- file文件名 撤销这个文件file的在工作区的修改（注意中间一定有--，不然就会变成另一个命令） 两个情况：1.修改后，还没有add，此时就是在工作区，那么执行这个命令，这次修改就会取消，回到仓库上的最新版本。 2，已经 add,还没有commit，也没有再更改，此时文件在缓存区，这个时候执行命令，并不会撤销修改，因为此时工作区没有内容  3，已经commit了，这时工作区也没有内容，也不会撤销
    rm file 删除工作区文件 此时工作区和仓库就有了不同 ，用git status 可查看删除了哪些文件
    git rm file 删完本地后又想删除仓库里的该文件 之后需要commit一下
    git checkout -- file 如果误删了工作区的本地文件，这个命令用于把版本库里的最新版本复制一份到工作区，所以无论工作区是修改了还是删除了，都可以用这个命令‘一键还原到最新版本’
    git branch 分支名  从当前分支创建一个分支 例如git branch develop.
    git checkout 分支名  切换到某分支
    git checkout -b 分支名.  用-b参数，表示从当前分支上创建并切换到分支
    git checkout -b 分支名1 origin/远程分支名2  把远程库里的某分支名2 创建在本地命名为分支名1
    git branch  查看当前分支git
    git merge 分支名  将分支快速合并到当前分支。 例如当前是master  git merge develop执行之后，就是把dev的内容同步到master了；
    git reset --hard 要回退到的commit_id  撤销merge操作
    git merge --no-ff 保留分支的commit历史
    git merge --no-ff -m '注解'  表示禁用Fast Forward格式地合并，并且会产生一个commit， -m '注解' 这个参数和单独用commit -m '注解' 一样
    git branch -d 分支名。 删除某分支  例如删除了dev，此时看git branch 结果是master 因为develop被删除了
    git branch -D 分支名  强行删除某分支 当新建的分支还没有被合并就被删除时，用-d会提示错误，用-D可以强行删除
    git log --graph --pretty=oneline --abbrev-commit  查看分支合并图
    git stash  保存当前分支的‘工作现场’，
    git stash list  查看当前所有存储的‘工作现场’  结果格式：stash@{0}:WIN on dev:f8743 add merge
    git stash apply 某  恢复某工作现场  例如 git stash apply stash@{0} 但恢复后并不删除stash，需要执行删除命令
    git stash drop 某   删除已经恢复完的stash
    git stash pop  恢复工作现场后直接删除 此时再用git stash list 应该查不到stash了
    git remote -v  查看远程库的信息 -v参数可选，现实详细信息
    git branch -vv 查看当前本地分支对应的远程分支gi
    git branch --unset-upstream 解除与当前映射的远程分支的关联
    git branch --set-upstream-to=origin/远程分支名 本地分支名  将本地的分支与远程库分支建立关联
    git pull  从与当前分支建立联系的远程库分支上拉取最新的提交,拉取到本地后将直接进行merge
    git pull origin 远程分支名：本地分支  其中 origin 是远程库的默认名称 将远程分支与本地分支merge 如果是与当前分支合并，冒号和本地分支名可以省略
    git rebase * 变基拉取, 会自动把*分支最新代码合并到执行本命令所在的分支上，并将本分支新提交的代码合并到*上，变基后找不到当前分支是从哪个分支拉取的，也不会有merge记录，所以公司开发中可能会禁用该命令 参考链接：https://blog.csdn.net/weixin_42310154/article/details/119004977
    git push origin 本地分支名：远程分支名  把本地分支推送到远程库中的对应分支 其中 origin 是远程库的默认名称 ，分支名是master或自定义的分支名。一般，默认分支master和开发分支都要与远程库保持同步，修复bug分支等可以不这样，前提是已经commit之类的都完成了
    git reset --hard HEAD@{n}  回退到想使用的版本n
    git tag 自定义标签名  给当前分支最新的一次提交打上标签名
    git tag 自定义标签名 commit_id    给对应的某次提交打上标签。用git log可以查看所有提交过的commit_id
    git tab -a 指定的标签名  -m '指定说明文字' commit_id.     在某次提交上创建带有说明信息的标签
    git tag.   查看所有标签。按字母牌讯
    git show  标签名      显示详细的标签信息

    hotfix热修复分支:
    使用场景：生产环境master有bug，但是开发分支develop还不稳定，需要从master拉取一个修复bug分支，最终必须合并回develop和master
    git checkout -b hotfix-<name> master 从master上拉取一个热修复分支
    git commit -a -m 'message' 在hotfix分支正常修改后提交
    git checkout master
    git merge --no-ff hot-<name> 切换回master分支后把热修复分支合并 之后也要合回develop。规则的一个例外是： 如果一个release分支已经存在，那么应该把hotfix合并到这个release分支，而不是合并到develop分支。当release分支完成后， 将bugfix分支合并回release分支也会使得bugfix被合并到develop分支。（如果在develop分支的工作急需这个bugfix，等不到release分支的完成，那你也可以把bugfix合并到develop分支）
    git tab -a <版本号>
    git push origin <版本号>   本地的标签需要推到远程仓库上
    git branch -d hotfix-<name> 删除临时分支
```
