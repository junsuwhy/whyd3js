
var d3radar=function(str_input,d_set,d_name){

    var w=800,h=600;
    var padding_left=20;
    var padding_top=20
    var radius=150,cx=radius+padding_left,cy=radius+padding_top;

    var dataset=[7,9,10,8,25,11,13];
    var dataname=['str','int','exp','png','jpg','gif','fip']

    var n=dataset.length;
    var data_max=Math.max.apply(null,dataset);

    //從d,i取得點座標
    function point_x(d,i){
      return cx+d/data_max*radius*Math.sin(i*2*Math.PI/n);
    }

    function point_y(d,i){
      return cy-d/data_max*radius*Math.cos(i*2*Math.PI/n);
    }

    function points(d,i){
      var arr=[];
      arr.push(point_x(d,i));
      arr.push(point_y(d,i));
      return arr;
    }

    //完成的points
    function polygon_data(){
      var str='';
      for (var i = 0; i <dataset.length; i++) {
        str+=point_x(dataset[i],i)+','+point_y(dataset[i],i)+' ';
      };
      return str;
    }

    //底圖
    function polygon_back(r){
      var str='';
      for (var i = 0; i <dataset.length; i++) {
        str+=(point_x(r*data_max/radius,i))+','+(point_y(r*data_max/radius,i))+' ';
      };
      str+=(cx)+','+(cy-r)+' ';
      return str;
    }

    //初始的圓心點points
    function polygon0(){
      var str='';
      for (var i = 0; i <n; i++) {
        str+=cx+','+cy+' ';
      };
      return str;
    }


    var beginx=50,beginy=50,rectheight=100,rectwidth=10,margin=2;

    var svg=d3.select('body')
              .selectAll('div')
              .selectAll('div '+str_input)
              .append('svg')
              .attr('width',w)
              .attr('height',h)
              .attr('class','new')
              .attr('fill','white');

    var g_back=svg.append('g')
    .attr('id','bg');

              //畫大圓
              g_back
              .append('circle')
              .attr('cx',cx)
              .attr('cy',cy)
              .attr('r',radius)
              .attr('stroke-width',2)
              .attr('stroke','orange');

              //畫多邊形底圖
              g_back.append('polyline')
              .attr('points',polygon_back(radius))
              .attr('fill','#a0d8ef');

              //畫多邊形底圖線
              for (var i =0; i < 5; i++) {
                  g_back.append('polyline')
                  .attr('points',polygon_back(radius*i/5))
                  .attr('stroke-width',1)
                  .attr('stroke','#007bbb')
                  .attr('fill','rgba(137,195,235,0)');
              };

              //畫色塊遮點多餘的線
              for(var i=0;i<n;i++){
              g_back.append('polyline')
              .attr('points',cx+','+cy+' '
                +(cx+0.9*radius*Math.sin((i+0.1)*2*Math.PI/n))+','
                +(cy-0.9*radius*Math.cos((i+0.1)*2*Math.PI/n))+' '
                +(cx+0.9*radius*Math.sin((i+0.9)*2*Math.PI/n))+','
                +(cy-0.9*radius*Math.cos((i+0.9)*2*Math.PI/n))+' '
                )
              .attr('fill','#a0d8ef');

              }

              //畫中心點
              g_back.append('circle')
              .attr('cx',cx)
              .attr('cy',cy)
              .attr('r',1)
              .attr('stroke-width',2)
              .attr('stroke','orange');

              //加字
      var g_text=svg
              .append('g')
              .attr('id','mytext')
              .selectAll('g#mytext');

              console.log(g_text.select('g#mytext'));
              console.log(g_text.data(dataname));

              g_text
              .data(dataname)
              .enter()
              .append('text')
              .text(function(d){return d})
              .attr('x',function(d,i){return point_x(data_max+2,i);})
              .attr('y',function(d,i){return point_y(data_max+2,i);})
              .style({
                'opacity':'1',
                'fill':'blue',
                'font-size': '12px'});

              //加值的字
        var g_text_val=svg
              .append('g')
              .attr('id','mytext_val')
              .selectAll('g#mytext_val');


              //畫多邊形
    var polygon=svg.append('polyline')
              .attr('points',polygon0())
              .attr('fill','blue')
              .attr('opacity',0.3)

              //畫字
              /*
              var text=svg.select('svg')
                .data(data)
                .enter()
                .append('text')
                .text(function(d){return d})
                .style('fill', 'steelblue').style('font-size', '12px')
                .attr('x',function(d,i){return 
                  cx+d/data_max*radius*Math.sin(i*2*Math.PI/n)
                  })
                .attr('y',function(d,i){return 
                  cy-d/data_max*radius*Math.cos(i*2*Math.PI/n)
                });
                */


    $('#pressme').on('click',show);

    //按下按鈕的動作
    var points_circle;
    var ani_circle_index=0;
    var final_circle;

    function show(){
      ani_circle_index=0
              //設隨機亂數
              for (var i = dataset.length - 1; i >= 0; i--) {
                dataset[i]=Math.random()*data_max;
              };
              //小圈圈移動
              run_circle();

              g_text.transition()
              .duration(2000)
              .style({'opacity':'1'});

              svg.select('g#mytext_val').remove();
              g_text_val=svg
              .append('g')
              .attr('id','mytext_val')
              .selectAll('g#mytext_val');
              
              g_text_val
              .data(dataset)
              .enter()
              .append('text')
              .text(function(d){return Math.floor(d)})
              .attr('id',function(d,i){return 'value'+i;})
              .attr('x',function(d,i){return point_x(data_max,i);})
              .attr('y',function(d,i){return point_y(data_max,i);})
              .style({
                'opacity':'0',
                'fill':'blue',
                'font-size': '12px'});

              //更新加值的字
              /*
              for (var i = 0; i < dataset.length; i++) {
                g_text.select('value'+i)
                .text(function(d,i){return d});
              };
              */
              

              
    }

    function run_circle(){
      console.log(svg.select('g#circle_points')[0][0]);
      //如果points_circle沒有值：
      if(ani_circle_index==0){
        svg.select('g#circle_points').remove();

        //畫小圓圈
        points_circle=svg
          .append('g')
          .attr('id','circle_points')
          .selectAll('g#circle_points')
          .data(dataset)
          .enter()
          .append('circle')
          .attr('cx',function(d,i){return point_x(d,i)})
          .attr('cy',function(d,i){return point_y(d,i)})
          .attr('r',3)
          .attr('stroke-width',1)
          .attr('stroke','red')
          .attr('id',function(d,i){return 'circle'+i})
          .attr('opacity',0)
          .on("mouseover", function(d,i){
            d3.select(this).attr("r", 5);
            d3.select('#value'+i)
            .attr('x',d3.mouse(this)[0]-5)
            .attr('y',d3.mouse(this)[1]-10)
            .transition()
            .style({'opacity':'1'});
          })
          .on("mouseout", function(d,i){
            d3.select(this).attr("r", 3);
            d3.select('#value'+i)
            .transition()
            .style({'opacity':'0'});
          });

    final_circle=svg.select('#circle'+(n-1))
    .attr('cx',cx)
    .attr('cy',cy)
    .attr('opacity',1);

      }
      switch(ani_circle_index){
        case n:
            //變化
              polygon.transition()
              .duration(1000)
              .attr('points',polygon_data());


        break;
        default:
          final_circle
          .transition()
          .duration(700/n)
          .ease('linear')
          .attr('cx',point_x(dataset[ani_circle_index],ani_circle_index))
          .attr('cy',point_y(dataset[ani_circle_index],ani_circle_index))
          .each('end',run_circle);

          if(ani_circle_index>0){
            //加入其他圈圈
            svg.select('#circle'+(ani_circle_index-1))
            .attr('opacity',1);
            /*
            svg.select('g#circle_points')
            .append('circle')
            .attr('cx',point_x(dataset[ani_circle_index-1],ani_circle_index-1))
            .attr('cy',point_y(dataset[ani_circle_index-1],ani_circle_index-1))
            .attr('r',3)
            .attr('stroke-width',1)
            .attr('stroke','red')
            .on("mouseover", function(d,i){
            d3.select(this).attr("r", 5);
            d3.select('#value'+i)
            .attr('x',d3.mouse(this)[0])
            .attr('y',d3.mouse(this)[1])
            .transition()
            .style({'opacity':'1'});
          })
          .on("mouseout", function(d,i){
            d3.select(this).attr("r", 3);
            d3.select('#value'+i)
            .attr('x',d3.mouse(this)[0])
            .attr('y',d3.mouse(this)[1]-10)
            .transition()
            .style({'opacity':'0'});
          })
          ;
          */
          }

        break;

      }


        ani_circle_index++;
    /*
                points_circle=svg.selectAll('svg')
                     .data(dataset)
                     .enter()
                     .append('circle')
                     .attr('cx',function(d,i){
                      return point_x(d,i);
                     })
                     .attr('cy',function(d,i){
                      return point_y(d,i);
                     })
                     .attr('r',3)
                     .attr('stroke-width',1)
                     .attr('stroke','red');

                     console.log(points_circle);
                     */

    }

}

console.log(d3);