# File Sync

## UI Workflow

1. Files-components
   1. list: 
      1. organization: 小三角 + typeIcon + name + 可折叠pannel
      2. well: 
         1. Container:
            1. hover 事件 + 选中icon
            2. 多选checkbox：Batch download files
         2. 小三角 + typeIcon + name + 可折叠pannel
         3. 
      3. wellbore: 
         1. Container: 
            1. hover 事件 + 选中icon
            2. 多选checkbox：Batch download files
         2. 小三角 + typeIcon + name + syncIcon + filesCount + 可折叠pannel
         3. 
      4. BhaRuns：
         1. Container: 
            1. hover 事件 + 选中icon
            2. 多选checkbox：Batch download files
         2. typeIcon + name + syncIcon + upload/download/add icons + filesCount + 可折叠pannel下拉icon
            1. uploadIcon click 事件：static + growing + folder 三种选项分别调起3个 dialog
            2. downloadIcon click 事件：调起系统下载
      5. folders:
         1. Container： 
            1. hover 事件
            2. 多选 Files：Batch download
         2. typeIcon + name + syncIcon + upload/download/add icons + filesCount + 可折叠pannel下拉icon
      6. File: 
         1. 组件最小单位
         2. checkbox + filename + fileType + downloadIcon + uploader + fileSize
   2. parameters：
      1. searchText: 每个组件都需要，用来高亮name里的搜索词片段
   3. Services:
   4. Interaction:
2. Transmission-components:
   1. list:
      1. Layout: 
         1. title(Transmission) + button + 多个Containers
         2. click 事件： 调起下拉框 3 个选项
            1. clear Inactive: 调起 confirm dialog + interaction
            2. pause all: Interaction
            3. resume all: Interaction
      2. Container:
         1. name + SyncIcon + path + FileItem-list
      3. FileItem: 
         1. 组件最小单位
         2. upload/download Icon + name + fileType + fileStatus + progress ratio + progress bar + pauseIcon
         3. hover 事件：打开本地文件系统显示文件
         4. click 事件：
            1. pause Icon：pause/resume
   2. parameters: none.
   3. Services:
   4. Interaction:
      1. clear inactive
      2. pause all:
      3. resume all:

## Data Workflow
