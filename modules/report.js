class Report {
  //This class is intended to wrap around vulnerability
  //data obtained from CoreOS Clair.
  //
  //managed Properties
  //_lastChanged: shows when the report has been changed
  //  will be set the first time, when report is created
  //
  //_images: contains vulnerability date on a per image
  //  basis. They are mostly stored as they come from 
  //  clair with some additions
  //
  constructor() {
    this._lastChanged = new Date();
    this._reports = [];

    this._filterByImage = function ( report ) {
     return report.image === this;
    }
  }

  //
  //methods
  //

  //updates the report belonging to the provided image (the image
  //name is included in the analysis as it comes from clair),
  //so just call updateImageReport(<clair analysis>) and the
  //report will be updated, if it already exists, a new entry
  //will be created otherwise.
  //
  updateImageReport( report ) {
    let index = this._reports.findIndex(this._filterByImage, report.image);
    
    if ( index >= 0 ) {
      this._reports[index] = report;
    }
    else {
      this._reports.push(report);
    }

    this._lastChanged = new Date();
  }
 
  //returns: the report belonging to the provided image or
  //throws: err if no report could be found
  getImageReport ( image ) {
    let res = this._reports.filter(this._filterByImage, image);

    if ( res.length === 0 ) {
      throw new Error("Report for image " + image + " could not be found");
    }
    else {
      return res[0];
    }
  }

  //returns: array consisting of vulnerabilities belonging
  //  to the provided image or
  //throws: if report to the image could not be found
  getImageVulnerabilities ( image ) {
    let report = this.getImageReport( image );
    return report.vulnerabilities;
  }

  //returns: Vulnerabilities as single CVEs
  //throws: error if report for image not found
  getImageCves ( image ) {
    let vulnerabilities = this.getImageVulnerabilities(image);
    let cves = [];
     vulnerabilities.forEach( (vb) => {
      cves = cves.concat(vb.Vulnerabilities);
    });
    return cves;
  }

  //
  //utility
  //
  
  //
  // get/set
  //
  get lastChanged() {
    return this._lastChanged;
  }

  get reportCount() {
    return this._reports.length;
  }

  set reports (reports) {
    this._reports = reports;
    this._lastChanged = new Date();
  }
}

module.exports.Report = Report;
