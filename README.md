# xsltwidget

Библиотеки для создания виджета контекстной рекламы на странице вебмастера.
Асинхронная загрузка шаблона (xslt)  и  даты (xml)


install : 
1) создать файл index.js
c содержанием


'use strict';
var MPWidgetLib = require('./../lib/MPWidgetLib');
window.MPWidgetLib =MPWidgetLib ;


2) на странице вебмастера разместить вызов библиотеки


MPWidgetLib.create(id,cssSelector,domainSourse,wid,css_);
id : - имя шаблона (table.xsl)
cssSelector : селектор  контейнеров, где создаётся виджет
domainSourse:  домен на котором будут расположены api сервисы
wid_ : - врутренний идентификатор клиента
css_ :  опционально - селектор где расположен контекстной

