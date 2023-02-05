

//define the lesson class which contains info for each individial lessons
class lesson {

    constructor(lessonName, week, day, time) {
        this.lessonName = lessonName; // name of lesson eg Y7 D&T
        this.week = week; // week indicating week A or B where 0 indicates A and 1 indicates B
        this.day = day; // day of the week 0 = monday, 1 = tuesday...
        this.time = time; // time object to indicate the start of the lesson
    }

}


//begin definition of the countdown class
export class countdown {


    //init the class with the csv file, the document to edit the html elements and set loading to false as data has not yet been loaded yet
    constructor(csvFileName, document) {
        this.csvPath = csvFileName;
        this.document = document;
        this.loadingComplete = false;
        this.alarmRunning = false;
        this.audio = new Audio("Alarm.mp3");
        this.flickerState = 0;
        this.deltaTimeFlick = 0;
        this.initTime = 0;
    }

    //update the heading workshop name with the workshop name within the csv file
    updateWorkshopName(text) {
        this.document.getElementById("workshopName").textContent = text;
    } 

    //load the CSV data into a readable structure 
    loadData() {

        //create the file reader object
        let reader = new FileReader();

        //read the csv file
        reader.readAsText(this.csvPath);

        //create a this to this as m_self
        const m_self = this;

        //when the csv have been loaded
        reader.onload = function() {
            //the loaded data is set to arrays of each of the csv rows
            m_self.loadedData =  reader.result.split("\n");

            //first format the data into a readable structure
            m_self.formatData();

            //set loading to complete as the data have been loaded into the class
            m_self.loadingComplete = true;
            // update the data on counters and upcoming classes
            m_self.Update();
        };

    }

    formatData() {
        //set the following variables from the CSV file
        this.workshopName = this.loadedData[0].split(",")[1];
        this.classLength = parseInt(this.loadedData[1].split(",")[1]);
        this.AlertBefore = parseInt(this.loadedData[2].split(",")[1]);

        // the term start date is stored as a Date object, firstly it is formatted into a way that enables the creation of the date object
        var termDate = this.loadedData[3].split(",")[1].split("/");
        this.TermStart = new Date(parseInt(termDate[2]), parseInt(termDate[1])-1, parseInt(termDate[0]));

        // counter for the while loop
        var counter = 0;
        //create an array in which all the lessons in the csv file will be stored as a lesson object
        this.lessons = [];

        //while loop through all the rows until it hits a black row
        while(this.loadedData[6+counter]) {
            // for loop through the days of each row Monday, tuesday, wednesday ... (5 days in a week including both Week A and B)
            for (var i = 0; i < 10; i++) {
                // lesson name is set to the current cell the loop is at
                // the cell data is stripped of \r and then read
                var currentLessonName = this.loadedData[6+counter].replace("\r","").split(",")[i+1];
                
                // if the cell is filled with a lesson name then proceed creating a lesson object to be appended
                if(currentLessonName) {
                    // a time object is created for the lesson start time, the year, month and date are arbitrary values
                    var time = new Date(2000, 0, 0, this.loadedData[6+counter].split(",")[0].split(":")[0], this.loadedData[6+counter].split(",")[0].split(":")[1]);
                    //A week object to indicate week A or B, 1 = B, 0 = A
                    var week = (i<5)? 0 : 1;
                    //A day object to indicate the day of the week, 0 = Monday, 1 = Tuesday ...
                    var day = i%5;
                    //create the lesson with the given variables
                    var tempLesson = new lesson(currentLessonName, week, day, time);
                    //push the lesson into the lessons array
                    this.lessons.push(tempLesson);
                }
            }
            //increase the while loop counter
            counter ++;
        }

    }

    //return an array of all the lessons on a specific week and day sorted by time
    getTodayLessons(week, day) {
        //create the array in which will be returned
        var lessonsToday = [];

        //loop through all elements withing the lessons array storing all the lessons
        for (var i = 0; i < this.lessons.length; i++) {
            // if the current lessons has the same week and day append it to the lessonsToday array
            if(this.lessons[i].week == week && this.lessons[i].day == day) {
                lessonsToday.push(this.lessons[i])
            }
        }

        //sort the lessonToday array by the lesson start time
        lessonsToday.sort((a, b) => a.time.getTime() - b.time.getTime());

        //return the sorted array
        return lessonsToday;


    }

    // returns the seconds the Date object stores, taking into account hours, minutes and seconds
    getSeconds(time) {
        return time.getSeconds() + time.getMinutes() * 60 + time.getHours() * 60 * 60;
    }
    //returns the minutes of the Date object stores, taking into account minutes and hours
    getMinutes(time) {
        return time.getMinutes() + time.getHours()*60;
    }

    runAlarm() {
        this.alarmRunning = true;
        this.audio.play();
        this.document.getElementById("alarm").style.display = "flex";
    }

    stopAlarm() {
        this.document.getElementById("alarm").style.display = "none";
        this.alarmRunning = false;
        this.audio.pause();
        this.audio.currentTime = 0;
        this.initTime = 0;
    }

    flickerScreen() {

        this.deltaTimeFlick = Date.now() - this.initTime;
        if(this.deltaTimeFlick > 1000) {

            if (this.flickerState) {
                this.flickerState = 0;
                this.document.getElementById("alarm").style.backgroundColor = "rgb(224, 103, 103)";
            } else {
                this.flickerState = 1;
                this.document.getElementById("alarm").style.backgroundColor = "rgb(255, 255, 255)";
            }

            this.initTime = Date.now();

        }

    }




    Update() {
        //if the data has not been loaded yet then skip this update call
        if (!this.loadingComplete) return;

        // var todayTemp = new Date();
        // var dtToday = new Date(2023, 2, 6, 9, 51, todayTemp.getSeconds());
        var dtToday = new Date();
        //calculate if the current day is week A or B
        var week = Math.trunc((dtToday.getTime() - this.TermStart.getTime())/1000/60/60/24/7)%2;
        
        //Find all the lessons that are run today
        var lessonsToday = this.getTodayLessons(week, dtToday.getDay()-1);

        var tempArray = []

        this.document.getElementById("countdown").innerHTML = "No Workshop Running";
        // update the workshop name
         this.updateWorkshopName(this.workshopName);

        // filters out lessons of the day that has already been past and runs workshop countdown logic
        for(var i = 0; i < lessonsToday.length; i++) {

            if (this.getMinutes(dtToday) > this.getMinutes(lessonsToday[i].time) && this.getMinutes(dtToday) < this.getMinutes(lessonsToday[i].time) + this.classLength) {
                var lessonTimeLeftMin = Math.trunc((this.getMinutes(lessonsToday[i].time) + this.classLength) - (this.getMinutes(dtToday) + this.AlertBefore));

                var lessonTimeLeftSec = Math.trunc( this.getSeconds(lessonsToday[i].time) + this.classLength * 60 - this.AlertBefore * 60 - this.getSeconds(dtToday) )%60;
                
                this.updateWorkshopName(lessonsToday[i].lessonName);

                if (lessonTimeLeftMin < 0) {
                    this.document.getElementById("countdown").innerHTML = "End of Workshop";
                } else {
                    this.document.getElementById("countdown").innerHTML = "Workshop Time Left " + lessonTimeLeftMin + ":" + (String(lessonTimeLeftSec).length == 2 ? lessonTimeLeftSec : "0" + lessonTimeLeftSec );
                }
                if (lessonTimeLeftMin < this.AlertBefore) {
                    this.runAlarm();
                    this.flickerScreen();
                } else {
                    this.stopAlarm();
                    console.log("STOPPED");
                }
            } 

            if(this.getMinutes(lessonsToday[i].time) > this.getMinutes(dtToday)) {
                tempArray.push(lessonsToday[i]);
            }
        }

        lessonsToday = tempArray;
        let dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        this.document.getElementById("currentWeek").innerHTML = dayOfWeek[dtToday.getDay()] + " Week " + (week == 0 ? "A": "B")

        //Loops through all the display element hiding the ones that doesnt have any classes and updating the ones that does have a lessons
        for(var i = 0; i < 5; i++) {
            if (i < lessonsToday.length) {

                //variables calculating the minutes and hours until the selected class starts
                var hourTillStart = Math.trunc((this.getMinutes(lessonsToday[i].time) - this.getMinutes(dtToday))/60);
                var minutesTillStart = String(Math.trunc((this.getMinutes(lessonsToday[i].time) - this.getMinutes(dtToday)))%60).length == 1 ? "0" + (Math.trunc((this.getMinutes(lessonsToday[i].time) - this.getMinutes(dtToday)))%60) : (Math.trunc((this.getMinutes(lessonsToday[i].time) -this.getMinutes(dtToday)))%60);

                //update this info to the frontend
                this.document.getElementById("className"+(i+1)).innerHTML = lessonsToday[i].lessonName;
                this.document.getElementById("classTime"+(i+1)).innerHTML = "Starting in " + hourTillStart + ":" + minutesTillStart;
            
            } else {
                //hide the lesson container if no lesson requires it
                this.document.getElementById("container"+(i+1)).style.display = "none";
            }
        }

    }

 }



