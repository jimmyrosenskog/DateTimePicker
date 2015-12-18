 (function () {
	 var monthNames =  [ "January", "February", "March", "April", "May", "June",
	 			"July", "August", "September", "October", "November", "December" ];

	 var shortWeekdayName = ["mo", "tu", "we", "th", "fr", "sa", "su"];

	function getMonthIndex(monthName) {
		return monthNames.indexOf(monthName);
	}

	function getSelectedMonth() {
		var monthsButtons = document.getElementsByClassName("active_monthButton");
		return monthsButtons[0].title.trim();
	}

	function getSelectedDate() {
		var dateButtons = document.getElementsByClassName("active_daysButton");
		return dateButtons[0].innerHTML.trim();
	}

	function daysInMonth(year, month) {
	    return new Date(year, month + 1, 0).getDate();
	}

	function getCurrentMonthName()
	{
		var date = new Date();
	 	return monthNames[date.getMonth()];
	}

	function getCurrentYear()
	{
		var date = new Date();
	 	return date.getFullYear();
	}

	function getSelectedDateTime()
	{
		return new Date(getSelectedYear(), getMonthIndex(getSelectedMonth()), getSelectedDate());
	}

	function getSelectedYear() {
		var yearButtons = document.getElementsByClassName("active_yearButton");
		if (!yearButtons[0])
		{
			return getCurrentYear();
		}

		return yearButtons[0].innerHTML.trim();
	}

	function getYearsHtml(years, activeYear) {
	 	var html = "";

	 	html += "<button class=\"selectYearButton\" id=\"prevYearButton\">" + "\<" + "</button>";

	 	for (var i = 0; i < years.length; i++) {
	 		if (activeYear == years[i])	{
	 			html += "<button title=\"" + years[i] +"\" class=\"yearButton active_yearButton\">" + years[i] + "</button>";
	 		}
	 		else {
	 			html += "<button title=\"" + years[i] +"\" class=\"yearButton\">" + years[i] + "</button>";
	 		} 		
	 	};

	 	html += "<button class=\"selectYearButton\" id=\"nextYearButton\">" + "\>" + "</button>";

	 	return html;
	 }

	 function createYears(selectedYear, years) {

		if (!selectedYear) {
			selectedYear = getCurrentYear();
		}

		if (!years)	{
			years = [selectedYear - 1, selectedYear, selectedYear + 1];
			setActiveYear = 1;
		}

	 	document.getElementById("dtpyears").innerHTML = getYearsHtml(years, selectedYear);

		addClickEvent("yearButton", function() {
			createMonths(getSelectedMonth());
		});

		var yearButtons = document.getElementsByClassName("yearsButton");

		for (var i = 0; i < yearButtons.length; i++) {
			if (yearButtons[i].innerHTML.trim() == selectedYear) {
				yearButtons[i].classList.add("active_monthButton");
			}
		};

		addClickEvent("yearButton", function() {
			createMonths(getSelectedMonth());
			createDays(getSelectedDate());
		});

		addYearClickEvent("nextYearButton", function() {
			handleChangeYear(function() {
				return [year , year + 1, year + 2];
			})
		});

		addYearClickEvent("prevYearButton", function() {
			handleChangeYear(function() {
				return [year - 2 , year - 1, year];
			})
		});
	}

	function handleChangeYear(getYears)
	{
	 	if (document.getElementsByClassName("yearButton")[1])	{
			year = parseInt(document.getElementsByClassName("yearButton")[1].innerHTML);
		}
		else
		{
			year = parseInt(selectedYear);
		}

		createYears(getSelectedYear(), getYears());
	}

	function getMonthsHtml() {
	 	var html = "";

	 	var date = new Date();
	 	var currentMonth = date.getMonth();

	 	for (var i = 0; i < monthNames.length; i++) {	
	 		html += "<button title=\"" + monthNames[i] +"\" class=\"monthButton\">" + monthNames[i][0] + "</button>";
	 	};

	 	return html;
	 }

	function getDayHeadersHtml() {
		var buttonHtml = ("<th class=\"dayHeader\"> #item </th>");
		var innerHtml = buttonHtml.replace("#item", shortWeekdayName[0]);

		for (var i = 1; i < shortWeekdayName.length; i++) {
			innerHtml += buttonHtml.replace("#item", shortWeekdayName[i]);
		};

		return innerHtml;
	}

	function createDays(selectedDate) {

		var selectedYearAndMonth = new Date(getSelectedYear(), getMonthIndex(getSelectedMonth()), 1);
		var dim = daysInMonth(selectedYearAndMonth.getFullYear(), selectedYearAndMonth.getMonth());
		var numberOfDateButtons = 42;

		createDateButtons("dtpdays", "daysButton", function () {
			var array = new Array(numberOfDateButtons);

			for (var i = 0; i < array.length; i++) {
				array[i] = "";
			};		

			var startDayIndex = getStartDayIndex(selectedYearAndMonth);

			var date = 1;

			for (var j = startDayIndex; j <= dim + startDayIndex - 1; j++) {
				array[j] = date++;
			};

			return array;
		});

		var daysButtons = document.getElementsByClassName("daysButton");

		if (!selectedDate) {
			var date = new Date();
			selectedDate = date.getDate();
		}
		else if (selectedDate > dim) {
			selectedDate = dim;
		}

		for (var i = 0; i < daysButtons.length; i++) {
			daysButtons[i].classList.remove("invisible_daysButton");

			if (daysButtons[i].innerHTML.trim() == selectedDate) {
				daysButtons[i].classList.add("active_daysButton");
			}
			else if (!daysButtons[i].innerHTML.trim())	{
				daysButtons[i].classList.add("invisible_daysButton");
			}
		};

		addClickEvent("daysButton");
	}

	function getStartDayIndex(date) {
		if (date.getDay() == 0) {
			return 6;
		}
		else {	
			return date.getDay() - 1;
		}
	}

	function createMonths(selectedMonth) {
		createMonthsButtons("dtpmonths", "monthButton");

		var monthsButtons = document.getElementsByClassName("monthButton");

		if (!selectedMonth)
		{
			selectedMonth = getCurrentMonthName();
		}

		for (var i = 0; i < monthsButtons.length; i++) {
			if (monthsButtons[i].title.trim() == selectedMonth) {
				monthsButtons[i].classList.add("active_monthButton");
			}
		};

		addClickEvent("monthButton", function() {
			createDays(getSelectedDate());
		});
	}

	function createDateButtons(parent, className, itemsFunc) {
		var items = itemsFunc();
		var buttonHtmlTempate = ("<td><button class=\"#className\"> #item </button></td>");
		var innerHtml = "";
		var tabelRow = "";

		var weekdayCounter = 0;

		for (var i = 0; i < items.length; i++) {
			var item = items[i];

			tabelRow += buttonHtmlTempate.replace("#item", item).replace("#className", className);
			weekdayCounter++;

			if (weekdayCounter === 7)
			{
				tabelRow = "<tr>" + tabelRow + "</tr>";
				innerHtml += tabelRow;
				tabelRow = "";
				weekdayCounter = 0;
			}
		};

		document.getElementById(parent).innerHTML = "<table class=\"daysTable\">" + getDayHeadersHtml() + innerHtml + "</table>";
	}

	function createMonthsButtons(parent, className) {
		document.getElementById(parent).innerHTML = getMonthsHtml();

		addClickEvent(className, function() {
			createDays(getSelectedDate());
		});
	}

	function addClickEvent(className, action) {
		var buttons = document.getElementsByClassName(className);

		for (var i = 0; i < buttons.length; i++) {

			if (buttons[i].innerHTML.trim() == "") {
				continue;
			}
			
			buttons[i].onclick = function (e) {

				if (!e) {
	        		e = window.event;
				}

	    		var sender = e.srcElement || e.target;

				for (var i = 0; i < buttons.length; i++) {
					buttons[i].classList.remove("active_" + className);
				}

				sender.classList.add("active_" + className);
				
				if (action)
				{
					action();
				}

				var dateSelectedEvent = new CustomEvent(
					"dateSelected", 
					{
						detail: {
							date: getSelectedDateTime()
						},
						bubbles: true,
						cancelable: true
					}
				);

				document.getElementById("main").dispatchEvent(dateSelectedEvent);
			}
		};
	}

	function addYearClickEvent(id, action) {
		var nextButton = document.getElementById(id);
		nextButton.onclick = function (e) {	
			if (action)
			{
				action();
			}
		}
	}

	function updateDateTimeDisplay(date) {
		document.getElementById("selectedDate").innerHTML = date.toDateString();
	}

	function addSelectedDateEvent(id) {
		document.getElementById("main").addEventListener('dateSelected', function (e) {	
			if (!e) {
	    		e = window.event;
			}

			var sender = e.srcElement || e.target;

			updateDateTimeDisplay(e.detail.date);
		}, false);
	}


	createYears();
	createMonths();
	createDays();
	addSelectedDateEvent("selectedDate");
	updateDateTimeDisplay(getSelectedDateTime());

})()