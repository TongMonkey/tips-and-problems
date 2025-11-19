# AuDB

## MileStone

1. Time: Q2~Q3

## Requirement

1. request record dashboard
   1. create request：会在 request dashboard 上多出一条记录，但目前还不会 trigger 任何 BE activity
   2. process request: 在 Action 里有一个按钮，CDSS 点击后，会 trigger a set of BE activities
   3. 做入口去 manage other dashboards
   4. 有不同的 request type, request template 来创建不同的 request record. 比如 add permission or revert permission 不同的 request type 将会 trigger 不同的 BE activity ( 这些 activity 目前是在 delfi or entitlement-admin 里做的)
   5. 这些 BE activity 会把 adub request permission 推到 ordit permission, 理论上 audb permission DB VS orbit permission DB 不会有差别，这个是通过 QC 来检查的
   6. 不需要先创建 container or user 再创建 request， 因为 request 里已经有了所有的所需信息，用户不需要像在 delfi or entitlement 里一样一步一步点击/创建。我们是根据这个 request 里的信息，调用一组API，通过功能组合的形式，把步骤精简( 原来的步骤是：把用户加到 delfi account/department/dp, 创建 user group, 把用户加到 user group, 把 user group 跟 dp 做 accociation，再给 user group 添加 permission)。
2. Action-process request
   1. 当用户点击 process, 开始 trigger 一系列后端 API. 这个过程中，可能有一个 UI 操作就是创建 user group, 剩下 全是由 BE API 完成的
   2. 比如这个request 是给一个用户 John-add-read permission. 这个时候有几种情况
      1. - 已经存在了 read permission group, 可以直接把用户添加进去 (API 做了什么：add user to the account + add user to associated department + add user to the group) 
      2. - 已经存在了 read permission group, 但还是想新创建一个 read group, 并把用户添加进去
      3. - 不存在 read permisson group, 需要创建一个 read group，并把用户添加进去 (API做了什么：Creat group in associated department + accociate group with data partiton + add user to the group) 创建的 user group 是真实存到 orbit 的。
3. QC:
   1. 对比 audb permission DB VS orbit permission DB
   2. 有可能堵不住所有的入口，有人可能从 delfi or entitlement admin 来操作，此时 QC 就可以体现差异，可以在这里 UI 进行一个统一的处理
4. user:
   1. audb 保留自己的 user db。 从 delfi 删除 user 不影响 audb user, 从 audb 发起 delete user request 会影响 delfi
   2. add extra paramters including company
5. user group/ department / subscription : 来自 orbit/delfi
6. grant:
   1. 选择一个 request on a container, 可以选择 multiple users.
7. Container: 保留 audb own container DB
8. user permission：audb 里 user permission 也自己保留一套，跟 ordit user permission 是两套

## Implement

### AuDB own Database

1. permission DB
2. user DB

### User DashBoard

1. create user in audb-DB 
   1. 创建的时候不管 ta 未来会被放在哪个 department。在 requst record dashboard trigger 的时候，会通过一些列 API 来指导这个用户会放在具体那个组织下，比如 request 里会有 well 信息，那就能找到上面的 org, 再上面的 dp, 从而找到对应的 department, 然后放到 delfi 中该 department 中
   2. create company
2. edit
3. delete
4. filter

### Container DashBoard

1. orphan well
2. create/delete
3. search
4. organization 关联 company(select options) 不在 tree 里显示，选中后可以 show & edit
5. manage permission only for AuDB

### Request DashBoard

1. create
2. QC

## Solution

## Enhancement
