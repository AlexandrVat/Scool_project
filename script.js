let curTable ;
let editingTd;
let mainDiv = document.getElementById('titletable');
let weekDay = ['Понеділок','Вівторок','Середа','Четвер','П`ятниця']
let subjects = ['Математика','Біологія','Геометрія', 'Інформатика','Укр. мова','Укр. література','Історія','Праця','Анг. мова','Фіз. культура','Природознавство']
let weekDayEn = ['monday','tuesday','wednesday','thursday','friday']

//Створюємо початковий розклад зайнять 
function createShedule(){
  for (let i = 0; i < weekDayEn.length; ++i) {      
    let rand;
    let serialObj;
    let objless = new Object(); 
    for (let j = 0; j < 7; ++j) { 
       rand = Math.floor(Math.random()*subjects.length);
       objless['item'+j] = subjects[rand];
    }
  
    createNewTable(weekDay[i],objless,i); 
  
    serialObj = JSON.stringify(objless); //Робимо з нього стрічку
    localStorage.setItem(weekDayEn[i], serialObj); //записуємо 
  }  
}

createShedule();


function createFromStorage(){
  for (let i = 0; i < weekDayEn.length; ++i) {      
    let rand;
    let serialObj;
    let objless = new Object(); 
    for (let j = 0; j < 7; ++j) { 
       rand = '12';
       objless['item'+j] = subjects[rand];
    }
      
    createNewTable(weekDay[i],objless,i); 
 
  }  
}

/*
let objless = {
    item1: 'Математика',
    item2: 'Біологія',
    item3: 'Геометрія',
    item4: 'Інформатика',
    item5: 'Укр. мова',
    item6: 'Укр. література',
    item7: 'Історія'
  };
  
  let serialObj = JSON.stringify(objless); //Робимо з нього стрічку
  localStorage.setItem('monday', serialObj); //записуємо 
*/
    //Створення таблиці
   function createNewTable(nameHead, nameItems, indx){

        //основа 
        let newtable = document.createElement('table'); 
            newtable.className = 'table11';
            newtable.setAttribute('id','table'+indx);

        let tbody = document.createElement('tbody');
        let thead = document.createElement('thead');
        
            newtable.appendChild(thead);
            newtable.appendChild(tbody);
        // робимо шапку таблиці  
        let row_1 = document.createElement('tr');
        let heading_1 = document.createElement('th');
            heading_1.setAttribute('colspan','2');
            heading_1.innerHTML = nameHead;
            row_1.appendChild(heading_1);
            thead.appendChild(row_1);
        //додаємо останні рядки
        let row_2 ;
        let row_2_data_1 ;
        let row_2_data_2  ;
        let counter = 1;  
        for (let key in nameItems) {
            row_2 = document.createElement('tr');
            row_2_data_1 = document.createElement('td');
            row_2_data_1.innerHTML = counter+'.';
            row_2_data_1.className = 'nonEdit'
            row_2_data_2 = document.createElement('td');
            row_2_data_2.innerHTML = nameItems[key];
            row_2_data_2.className = 'trueEdit'
        
            row_2.appendChild(row_2_data_1);
            row_2.appendChild(row_2_data_2);
            tbody.appendChild(row_2);
            counter++;
           }

        //div.innerHTML = '';
        mainDiv.appendChild(newtable);

  }

  
  /*createNewTable(weekDay[0],objless,0);
  createNewTable(weekDay[1],objless,1);
  createNewTable(weekDay[2],objless,2);
  createNewTable(weekDay[3],objless,3);
  createNewTable(weekDay[4],objless,4);
  */


//Знаходимо по якій з таблиць був клік і починаємо з нею працювати
$(document).on('click', 'table[class^="table"]', function(event) {
    event.preventDefault();
     
    if (event.target.className != 'nonEdit'){    //не редагуємо перші стовбці 
            let table = document.getElementById(event.currentTarget.id);
            let target = event.target.closest('.edit-cancel,.edit-ok,.edit-delete,td');
            let tableContent = table.querySelectorAll('td.trueEdit');
            let newObjLess = new Object();
            console.log('122');
            console.log(target);

            if (!table.contains(target)) return;

            if (target.className == 'edit-cancel') {
                finishTdEdit(editingTd.elem, false);
            } else if (target.className == 'edit-ok') {
                finishTdEdit(editingTd.elem, true);
                 //якщо заходимо на редагування зберігаємо зміни в сховищі              
                for (let i = 0; i < tableContent.length; ++i) {  
                  newObjLess['item'+i] = tableContent[i].innerText;
                }
               //console.log(newObjLess);
               //console.log(event.currentTarget.id.slice(-1));
               localStorage.removeItem(weekDayEn[event.currentTarget.id.slice(-1)]);
               localStorage.setItem(weekDayEn[event.currentTarget.id.slice(-1)], JSON.stringify(newObjLess)) ;
               
            } else if (target.className == 'edit-delete') {                     
                     target.closest('tr').remove();
                     tableContent = table.querySelectorAll('td.trueEdit');
                       //якщо заходимо на редагування зберігаємо зміни в сховищі              
                      for (let i = 0; i < tableContent.length; ++i) { 
                        newObjLess['item'+i] = tableContent[i].innerText;
                      }

                     localStorage.removeItem(weekDayEn[event.currentTarget.id.slice(-1)]);
                     localStorage.setItem(weekDayEn[event.currentTarget.id.slice(-1)], JSON.stringify(newObjLess)) ;
                     finishTdEdit(editingTd.elem, false);

            }else if (target.nodeName == 'TD') {
                if (editingTd) return; // уже редактується

                makeTdEditable(target);
            }
     }
});


function makeTdEditable(td) {
  editingTd = {
    elem: td,
    data: td.innerHTML
  };

  td.classList.add('edit-td'); // td зараз редактується змінюємо для нього CSS

  let textArea = document.createElement('textarea');
  textArea.style.width = td.clientWidth + 'px';
  textArea.style.height = td.clientHeight + 'px';
  textArea.className = 'edit-area';

  textArea.value = td.innerHTML;
  td.innerHTML = '';
  td.appendChild(textArea);
  textArea.focus();

  td.insertAdjacentHTML("beforeEnd",
    '<div class="edit-controls"><button class="edit-ok">OK</button><button class="edit-cancel">CANCEL</button><button class="edit-delete">DELETE</button></div>'
  );
}

function finishTdEdit(td, isOk) {
  if (isOk) {
    td.innerHTML = td.firstChild.value;
  } else {
    td.innerHTML = editingTd.data;
  }
  td.classList.remove('edit-td');
  editingTd = null;
}


//---------------- Cлайдер

//Створюємо кнопочки навігації
$(document).ready(function()
{
  $(".slider").each(function ()
  {
    let obj = $(this);
    $(obj).append("<div class='nav'></div>");

    $(obj).find("li").each(function ()
    {
      $(obj).find(".nav").append("<span rel='"+$(this).index()+"'></span>");
      $(this).addClass("slider"+$(this).index());
    });

    $(obj).find("span").first().addClass("on");
  });
});

function sliderJS (obj, sl) // функції слайдеру
{
let ul = $(sl).find("ul");
let bl = $(sl).find("li.slider"+obj);
let step = $(bl).width();
$(ul).animate({marginLeft: "-"+step*obj}, 500);
}

$(document).on("click", ".slider .nav span", function() // Клік по кнопкам слайдеру
{
let sl = $(this).closest(".slider");
$(sl).find("span").removeClass("on");   //Зміна CSS для анімування натискання на кнопочки
$(this).addClass("on");
let obj = $(this).attr("rel");
sliderJS(obj, sl);
return false;
});