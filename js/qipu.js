$().ready(function(){
	draw_staff(18,18);//绘棋盘
	staff_event();
});

function draw_staff(rows,cols){
	//1.绘制棋盘背景
	var html = "";
	for(var i = 0;i < rows;i++){
		for(var j = 0;j < cols;j++){
			html += '<div class="qizikuai_bg"></div>';
		}
	}
	var one_width = 30;//一个格宽度为20
	var border_width = 1;//边线宽1象素
	var width = one_width * rows + border_width * 2 * rows;
	$('.qipan_bg').css({width:width}).empty().append(html);

	//2.绘制棋子容器，用于在上面放置棋子
	var html = "";
	for(var i = 0;i < rows+1;i++){
		for(var j = 0;j < cols+1;j++){
			(function(row,col){
				html += '<div class="qipan_kuai_cntr" id="qipan_kuai_cntr_'+row+'_'+col+'"><div class="qizi"></div></div>';
			})(i,j);
		}
	}
	var width = one_width * (rows+1) + border_width * 2 * (rows+1);
	$('.qipan_kuai_cntrs').css({width:width}).empty().append(html);
}

//显示下一步
//[{row:1,col:2,to_status:'white'},{row:1,col:4,to_status:'white'},{row:2,col:4,to_status:'black'}]
function next_queue(json){
	//var json = [{row:1,col:2,to_status:'white'},{row:1,col:4,to_status:'white'},{row:2,col:4,to_status:'black'},{row:2,col:5,to_status:'empty',old_status:'black'}];
	if(json.length){
		for(var i = 0,j = json.length;i < j;i++){
			var row = json[i].row;
			var col = json[i].col;
			var to_status = json[i].to_status;
			if(to_status=='empty'){
				$('#qipan_kuai_cntr_'+row+'_'+col).find('.qizi').removeClass("white black");
			}else{
				$('#qipan_kuai_cntr_'+row+'_'+col).find('.qizi').addClass(to_status);
			}
			
		}
	}
}

//显示上一步，下一步的逆操作
function prev_queue(json){
	//var json = [{row:1,col:2,to_status:'white'},{row:1,col:4,to_status:'white'},{row:2,col:4,to_status:'black'},{row:2,col:5,to_status:'empty',old_status:'black'}];
	if(json.length){
		for(var i = 0,j = json.length;i < j;i++){
			var row = json[i].row;
			var col = json[i].col;
			var to_status = json[i].to_status;
			if(to_status=='empty'){
				var old_status = json[i].old_status;
				if(!old_status){
					console.log('to_status为empty的，必须设置old_status属性');
				}
				$('#qipan_kuai_cntr_'+row+'_'+col).find('.qizi').addClass(old_status);
			}else{
				$('#qipan_kuai_cntr_'+row+'_'+col).find('.qizi').removeClass("white black");
			}
		}
	}
}


function staff_event(){
	//点击第一步,指针归原始状态，棋盘归原始状态
	$('.first_step').click(function(){
		i_now = -1;
		$('.qipan_kuai_cntrs .qizi').removeClass("white black");
		show_i_now();
		draw_cur_qizi_flag();
	});

	//点击下一步,指针加1
	$('.next_step').click(function(){
		i_now++;
		if(i_now>=data.length){
			console.log('已经是最后一步了...');
			i_now--;//把之前加的1再减回去，因为这一步没有进行操作，所以需要恢复
			return;
		}
		next_queue(data[i_now]);
		show_i_now();
		draw_cur_qizi_flag();
	});

	//点击上一步,指针减1
	$('.prev_step').click(function(){
		if(i_now <= -1){
			console.log('已经是第一步了...');
			//i_now++;
			return;
		}
		prev_queue(data[i_now]);
		i_now--;
		show_i_now();
		draw_cur_qizi_flag();
	});

	//最后一步，循环数组，依序显示出来
	$('.last_step').click(function(){
		if(data.length){
			for(var i = 0,j = data.length;i < j;i++){
				next_queue(data[i]);
			}
			i_now = data.length - 1;
			show_i_now();
			draw_cur_qizi_flag();
		}
	});

}
//显示的步数等于i_now加1
function show_i_now(){
	$('.cur_step').val(i_now+1);
}
function draw_cur_qizi_flag(){
	var json = data[i_now];
	if(json && json.length){
		var main_qizi = data[i_now][0];//第一个位置，代表每走一步，下的棋子，后面的位置可以放消除的棋子（如果有的话）
		var row = main_qizi.row;
		var col = main_qizi.col;
		$('#cur_qizi_flag').remove();
		$('#qipan_kuai_cntr_'+row+'_'+col).find('.qizi').append("<div id='cur_qizi_flag'></div>");
	}else{
		$('#cur_qizi_flag').remove();
	}
}
//[{row:1,col:2,to_status:'white'},{row:1,col:4,to_status:'white'},{row:2,col:4,to_status:'black'}]
var i_now = -1;
var data = [
			[{row:3,col:16,to_status:'black'}],
			[{row:3,col:3,to_status:'white'}],
			[{row:16,col:15,to_status:'black'}],
			[{row:15,col:3,to_status:'white'}],
			[{row:2,col:14,to_status:'black'}],
			[{row:14,col:15,to_status:'white'}],
			[{row:14,col:16,to_status:'black'}],
			[{row:13,col:16,to_status:'white'}],
			[{row:15,col:16,to_status:'black'}],
			[{row:12,col:15,to_status:'white'}],
			[{row:16,col:13,to_status:'black'}],
			[{row:4,col:16,to_status:'white'}],
			[{row:4,col:15,to_status:'black'}],
			[{row:5,col:16,to_status:'white'}],
			[{row:3,col:17,to_status:'black'}],
			[{row:5,col:15,to_status:'white'}],
			[{row:11,col:16,to_status:'black'}],
			[{row:4,col:14,to_status:'white'}],
			[{row:11,col:15,to_status:'black'}],
			[{row:11,col:14,to_status:'white'}],
			[{row:12,col:14,to_status:'black'}],
			[{row:10,col:14,to_status:'white'}],
			[{row:12,col:13,to_status:'black'}],
			[{row:9,col:16,to_status:'white'}],
			[{row:13,col:17,to_status:'black'}],
			[{row:16,col:6,to_status:'white'}],
			[{row:5,col:2,to_status:'black'}],
			[{row:2,col:5,to_status:'white'}],
			[{row:3,col:1,to_status:'black'}],
			[{row:7,col:2,to_status:'white'}],
			[{row:7,col:3,to_status:'black'}],
			[{row:8,col:3,to_status:'white'}],
			[{row:6,col:3,to_status:'black'}],
			[{row:2,col:2,to_status:'white'}],
			[{row:8,col:2,to_status:'black'}],
			[{row:9,col:2,to_status:'white'}],
			[{row:8,col:1,to_status:'black'}],
			[{row:9,col:3,to_status:'white'}],
			[{row:7,col:1,to_status:'black'}],
			[{row:11,col:12,to_status:'white'}],
			[{row:12,col:12,to_status:'black'}],
			[{row:12,col:11,to_status:'white'}],
			[{row:11,col:13,to_status:'black'}],
			[{row:10,col:13,to_status:'white'}],
			[{row:13,col:11,to_status:'black'}],
			[{row:11,col:11,to_status:'white'}],
			[{row:13,col:10,to_status:'black'}],
			[{row:13,col:12,to_status:'white'}],
			[{row:14,col:12,to_status:'black'}],
			[{row:12,col:17,to_status:'white'}],
			[{row:11,col:17,to_status:'black'}],
			[{row:14,col:17,to_status:'white'}],
			[{row:13,col:18,to_status:'black'}],
			[{row:13,col:15,to_status:'white'}],
			[{row:14,col:14,to_status:'black'}],
			[{row:15,col:14,to_status:'white'}],
			[{row:14,col:13,to_status:'black'}],
			[{row:12,col:18,to_status:'white'}],
			[{row:15,col:15,to_status:'black'}],
			[{row:2,col:13,to_status:'white'}],
			[{row:1,col:13,to_status:'black'}],
			[{row:1,col:14,to_status:'white'}],
			[{row:1,col:15,to_status:'black'}],
			[{row:3,col:14,to_status:'white'}],
			[{row:2,col:15,to_status:'black'}],
			[{row:1,col:12,to_status:'white'}],
			[{row:0,col:14,to_status:'black'},{row:1,col:14,to_status:'empty',old_status:'white'}],
			[{row:2,col:12,to_status:'white'}],
			[{row:3,col:6,to_status:'black'}],
			[{row:5,col:6,to_status:'white'}],
			[{row:2,col:6,to_status:'black'}],
			[{row:3,col:5,to_status:'white'}],
			[{row:4,col:6,to_status:'black'}],
			[{row:5,col:5,to_status:'white'}],
			[{row:5,col:7,to_status:'black'}],
			[{row:6,col:7,to_status:'white'}],
			[{row:5,col:8,to_status:'black'}],
			[{row:6,col:8,to_status:'white'}],
			[{row:3,col:8,to_status:'black'}],
			[{row:5,col:9,to_status:'white'}],
			[{row:1,col:9,to_status:'black'}],
			[{row:3,col:9,to_status:'white'}],
			[{row:2,col:9,to_status:'black'}],
			[{row:4,col:9,to_status:'white'}],
			[{row:7,col:6,to_status:'black'}],
			[{row:1,col:5,to_status:'white'}],
			[{row:6,col:6,to_status:'black'}],
			[{row:4,col:5,to_status:'white'}],
			[{row:2,col:7,to_status:'black'}],
			[{row:8,col:7,to_status:'white'}],
			[{row:11,col:9,to_status:'black'}],
			[{row:1,col:7,to_status:'white'}],
			[{row:1,col:6,to_status:'black'}],
			[{row:0,col:6,to_status:'white'}],
			[{row:1,col:8,to_status:'black'}],
			[{row:0,col:7,to_status:'white'}],
			[{row:0,col:8,to_status:'black'}],
			[{row:0,col:5,to_status:'white'}],
			[{row:0,col:10,to_status:'black'}],
			[{row:16,col:8,to_status:'white'}],
			[{row:8,col:8,to_status:'black'}],
			[{row:7,col:7,to_status:'white'}],
			[{row:9,col:7,to_status:'black'}],
			[{row:8,col:6,to_status:'white'}],
			[{row:9,col:6,to_status:'black'}],
			[{row:13,col:2,to_status:'white'}],
			[{row:16,col:3,to_status:'black'}],
			[{row:16,col:2,to_status:'white'}],
			[{row:16,col:5,to_status:'black'}],
			[{row:16,col:4,to_status:'white'}],
			[{row:15,col:5,to_status:'black'}],
			[{row:15,col:6,to_status:'white'}],
			[{row:14,col:3,to_status:'black'}],
			[{row:14,col:2,to_status:'white'}],
			[{row:15,col:4,to_status:'black'}],
			[{row:17,col:3,to_status:'white'},{row:16,col:3,to_status:'empty',old_status:'black'}],
			[{row:17,col:4,to_status:'black'}],
			[{row:16,col:3,to_status:'white'}],
			[{row:17,col:6,to_status:'black'}]
		];

