# xsltwidget

Библиотеки для создания виджета контекстной рекламы на странице вебмастера.
Асинхронная загрузка шаблона (xslt)  и  даты (xml)


install : 
1) создать файл index.js c содержанием <br>

'use strict'; <br>
var MPWidgetLib = require('./../lib/MPWidgetLib'); <br>
window.MPWidgetLib =MPWidgetLib ; <br>


2) на странице вебмастера разместить вызов библиотеки <br>

MPWidgetLib.create(id,cssSelector,domainSourse,wid,css_); <br>
id : - имя шаблона (table.xsl) <br>
cssSelector : селектор  контейнеров, где создаётся виджет <br>
domainSourse:  домен на котором будут расположены api сервисы <br>
wid_ : - врутренний идентификатор клиента <br>
css_ :  опционально - селектор где расположен контекстной <br>

