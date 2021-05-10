/* 
IndexedDB 鼓励使用的基本模式如下所示：
	1.打开数据库。
	2.在数据库中创建一个对象仓库（object store）。
	3.启动一个事务，并发送一个请求来执行一些数据库操作，像增加或提取数据等。
	4.通过监听正确类型的 DOM 事件以等待操作完成。
	5.在操作结果上进行一些操作（可以在 request 对象中找到）
*/
window.indexedDB =
	window.indexedDB ||
	window.mozIndexedDB ||
	window.webkitIndexedDB ||
	window.msIndexedDB;
window.IDBTransaction =
	window.IDBTransaction ||
	window.webkitIDBTransaction ||
	window.msIDBTransaction;
window.IDBKeyRange =
	window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
if (!window.indexedDB) {
	window.alert(
		"Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
	);
}
/**	创建一个链接数据库实例 
 *  .open 打开一个叫xxtIndexDB的数据库
 *  @param 第一个参数：数据库Name
 *  @param 第二个参数：数据库version !import:版本号是一个 unsigned long long 数字，这意味着它可以是一个
 * 			特别大的数字，但不能使用浮点数，否则它将会被转变成离它最近的整数，这可能导致 upgradeneeded 事件不会被触发。例如，不要使用 2.4 作为版本号。
 * 	open 请求不会立即打开数据库或者开始一个事务。 对 open() 函数的调用会返回一个我们可以作为事件来处理的包含 result（成功的话）或者错误值的 IDBOpenDBRequest 对象
 *  @returns open 函数的结果是一个 IDBDatabase 对象的实例。
 *  如果数据库不存在，open 操作会创建该数据库，然后 onupgradeneeded 事件被触发，你需要在该事件的处理函数中创建数据库模式。如果数据库已经存在，但你指定了一个更高的数据库版本，会直接触发 onupgradeneeded 事件，允许你在处理函数中更新数据库模式。
 */
let dbRequest = window.indexedDB.open("xxtIndexDB", 1);
let db, //数据库对象
	objectStore, //表对象
	ioTransaction, //写事务
	readTransaction, //读事务
	dataList = [ //测试数据
		{
			id: 1,
			name: "张三",
			age: 24,
			email: "zhangsan@example.com",
		},
		{
			id: 2,
			name: "李四",
			age: 24,
			email: "lisi@example.com",
		},
	];
/**
 * 创建成功 如果 onupgradeneeded 事件成功执行完成，打开数据库请求的 onsuccess 处理函数会被触发
 * @param {*} event
 */
dbRequest.onsuccess = (event) => {
	db = dbRequest.result; //数据库对象
	console.log("数据库打开成功", db);
};
/**
 * 创建失败
 * @param {*} event
 */
dbRequest.onerror = (event) => {
	console.log("数据库打开失败");
};
/** onupgradeneeded 是我们唯一可以修改数据库结构的地方;在这里面，我们可以创建和删除对象存储空间以及构建和删除索引。
 * 如果指定的版本号，大于数据库的实际版本号，就会发生数据库升级事件upgradeneeded
 * 注意： 该事件仅在较新的浏览器中实现了
 * @param {*} event
 */
dbRequest.onupgradeneeded = function (event) {
	db = event.target.result; //拿到数据库IDBDataBase实例
	if (!db) return;
	objectStore = createDB("person", { keyPath: "id" });
	if (objectStore) {
		createIndex("name", "name", { unique: false }); //名字可能会重复，所以允许不唯一
		createIndex("email", "email", { unique: true });
		//使用事务的 oncomplete 事件确保在插入数据前对象仓库已经创建完毕
		objectStore.transaction.oncomplete = function (event) {
			writeData("person", "readwrite", dataList);
		};
	}
};
/**
 * 创建数据库对象
 * @returns objectStore
 */ 
function createDB(dbName, paramObj) {
	//判断当前没有同名表格
	if (!db.objectStoreNames.contains(dbName)) {
		objectStore = db.createObjectStore(dbName, paramObj); //新建一个叫person的表格，主键叫id
	}
	return objectStore;
}
/**
 * 添加索引
 * @param {string} 索引名称
 * @param {string} 索引所在属性
 * @param {object} 配置对象 unique表示该属性是否包含重复的值
 */
function createIndex(indexName, dataName, paramObj) {
	objectStore.createIndex(indexName, dataName, paramObj);
}
// 写数据
function writeData(dbName, mode = "readwrite", dataList = []) {
	// 新建一个事务 写入数据时需要事务 新建时必须指定表格名称和操作模式（"只读"或"读写"）
	ioTransaction = db.transaction([dbName], mode);
	// 得到一个IDBObjectStore对象
	let ioObjectStore = ioTransaction.objectStore(dbName);
	// 通过IDBObjectStore对象.add方法对表格进行写入
	dataList.forEach((item) => {
		ioObjectStore.add(item);
	});
	// 监听写入完成
	ioTransaction.oncomplete = (event) => {
		console.log("数据写入完成oncomplete");
		readData("person", "readonly", 1); //调用查询
	};
	// 监听写入失败
	ioTransaction.onerror = (event) => {
		console.log("数据写入失败");
	};
}
// 读数据
function readData(dbName, mode = "readonly", indexKey) {
	readTransaction = db.transaction([dbName], mode);
	let readObjectStore = readTransaction.objectStore(dbName);
	let readRequest = readObjectStore.get(indexKey);
	readRequest.onerror = function (event) {
		// 错误处理!
	};
	readRequest.onsuccess = function (event) {
		let student = event.target.result;
		alert("查询信息：" + JSON.stringify(student));
	};
}
