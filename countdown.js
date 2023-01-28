
class lesson {

    constructor(lessonName, week, day, time) {
        this.lessonName = lessonName;
        this.week = week;
        this.day = day;
        this.time = time;
    }

}





export class countdown {

    constructor(csvFileName, document) {
        this.csvPath = csvFileName;
        this.document = document;
    }

    updateWorkshopName() {
        this.document.getElementById("workshopName").textContent = this.workshopName;

    } 

    loadData() {

        let reader = new FileReader();

        reader.readAsText(this.csvPath);

        const m_self = this;

        reader.onload = function() {
            m_self.loadedData =  reader.result.split("\n");

            m_self.formatData();
            m_self.updateWorkshopName();
        };

    }

    formatData() {
        this.workshopName = this.loadedData[0].split(",")[1];
        this.classLength = this.loadedData[1].split(",")[1];
        this.AlertBefore = this.loadedData[2].split(",")[1];

        var termDate = this.loadedData[3].split(",")[1].split("/");
        this.TermStart = new Date(parseInt(termDate[2]), parseInt(termDate[1])-1, parseInt(termDate[0]));


        var counter = 0;
        this.lessons = [];

        while(this.loadedData[6+counter]) {
            
            for (var i = 0; i < 10; i++) {
                var currentWorkshopName = this.loadedData[6+counter].replace("\r","").split(",")[i+1]
                if(currentWorkshopName) {

                    var time = new Date(2000, 0, 0, this.loadedData[6+counter].split(",")[0].split(":")[0], this.loadedData[6+counter].split(",")[0].split(":")[1])

                    var tempLesson = new lesson(currentWorkshopName, (i<5)? 0 : 1, i%5, time);
                    this.lessons.push(tempLesson);
                    //console.log(tempLesson);
                }
            }
            
            counter ++;
        }
        this.getTodayLessons();

    }

    getTodayLessons() {
        var lessonsToday = [];
        for (var i = 0; i < this.lessons.length; i++) {
            if(this.lessons[i].week == 0 && this.lessons[i].day == 0) {
                lessonsToday.push(this.lessons[i])
            }
        }

        lessonsToday.sort((a, b) => a.time.getTime() - b.time.getTime());

        return lessonsToday;


    }





 }



