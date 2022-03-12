// 自测题1
function fix(word){
    word = word.split("");
    let strIter = word[Symbol.iterator]();
    let pre = "", cur = "", map = new Map(), obj=strIter.next(),index=0;
    while(!obj.done){
        let char = obj.value;
        if(char !== cur){
            map.delete(pre);
        }
        if(map.has(char)){
            let count = map.get(char);
            if(count===1){
                if(!map.get(pre) || map.get(pre)<2){
                    map.set(char, count+1);
                }else{
                    word[index] = "";
                }
            }else if(count===2){
                // 连续三个
                word[index] = "";
            }
        }else{
            // first
            map.set(char, 1);
            pre = cur;
            cur = char;
        }
        obj = strIter.next();
        index++;
    }
    return word.join('');
}
// var testData = ['helloo','wooooooow','aaabbaabbbaa'];
// testData.forEach((item)=>{
//     console.log(fix(item));
// });

// 自测题2
var nums = [
    [1, 2],
    [5, 3],
    [4, 6],
    [7, 5],
    [8, 4],
    [9, 0]
]
function border(nums){
    let maxW = 0, maxArr = [], maxH = 0;
    for(let i=0;i<nums.length; i++){
        let [w,h] = nums[i];
        if(w>=maxW || h>= maxH){
            maxArr = maxArr.filter(([x,y])=>{
                return !(x<w && y<h) ;
            })
            maxW = Math.max(w, maxW);
            maxH = Math.max(h, maxH);
            maxArr.push([w,h]);
        }
    }
    return maxArr;
}
// border(nums);

// 自测题3 

// 自测题4 对应力扣 143 重排链表
var reorderList = function (head) {
    // 快慢指针 当快指针f遍历到结尾时，慢指针s指向的节点，一定是预期链表的尾节点，用last存储
    let s = head, f = head, last = null;
    while(f!==null && f.next !==null){
        s.next.pre = s;
        s = s.next;
        f = f.next.next;
    }
    // 当链表个数为奇偶两种情况时，s指针的处理是不同的，所以就将偶数长度时单独处理一下，之后都是奇数个链表的处理方案。
    if(f===null){
        last = s;
        s.pre.next = s.next;
        s = s.pre;
        last.next = null;
    }
    let pre = s?.pre, next = s?.next;
    f = s; //存储当前最后一个节点，由于f指针没有别的用处了，为了不再声明变量，这里直接借用f，本身并没有特别的引用逻辑
    f.next = last; 
    // 不需要额外申请链表空间
    while(pre){
        s = next.next;
        next.next = pre.next;
        pre.next = next;
        pre = pre?.pre;
        next = s;
    }
    return head;
};






