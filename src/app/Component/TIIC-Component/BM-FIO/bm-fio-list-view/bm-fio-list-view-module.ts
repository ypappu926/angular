export class FIOPendingData {
    public getJsonData(excelData, index, isBMLogin) {
        const data =  {
            'Sr no': index,
            'Name of Unit': excelData.nameOfUnit,
            'Email': excelData.email,
            'Mobile': excelData.mobile,
            'District': excelData.district,
            'Status': excelData.statusName,
            'Subsidary FIO': excelData.subFioName
        };
        if(isBMLogin) {
            data['Main FIo'] = excelData.fioName;
            data['Subsidary FIO'] = excelData.subFioName;
        } else {
            data['Subsidary FIO'] = excelData.subFioName;
        }
        return data;
    }
}

export class BMPendingData {
    public getJsonData(excelData, index, isBMLogin) {
        const data = {
            'Sr no': index,
            'Name of Unit': excelData.nameOfUnit,
            'Email': excelData.email,
            'Mobile': excelData.mobile,
            'District': excelData.district,
            'Status': excelData.statusName
        };
        if(isBMLogin) {
            data['Main FIo'] = excelData.fioName;            
            data['Response'] = excelData.response == 15 ? 'Negative' : excelData.response == 14 ? 'Positive' : '-';
        }
        data['Subsidary FIO'] = excelData.subFioName;
        return data;
    }
}

export class NegativeData {
    getJsonData(excelData, index, isBMLogin) {
        const data = {
            'Sr no': index,
            'Name of Unit': excelData.nameOfUnit,
            'Email': excelData.email,
            'Mobile': excelData.mobile,
            'District': excelData.district
        };
        if(isBMLogin) {
            data['Main FIo'] = excelData.fioName;            
            data['Response'] = excelData.response == 15 ? 'Negative' : excelData.response == 14 ? 'Positive' : '-';            
        }
        data['Subsidary FIO'] = excelData.subFioName;
        data[isBMLogin ? 'Status By FIO' : 'Status By BM'] = isBMLogin ? excelData.statusName : excelData.bmStatusName;
        return data;
    }
}

export class PositiveData {
    getJsonData(excelData, index, isBMLogin) {
        const data = {
            'Sr no': index,
            'Name of Unit': excelData.nameOfUnit,
            'Email': excelData.email,
            'Mobile': excelData.mobile,
            'District': excelData.district
        };
        if(isBMLogin) {
            data['Main FIo'] = excelData.fioName;            
            data['Response'] = excelData.response == 15 ? 'Negative' : excelData.response == 14 ? 'Positive' : '-';            
        }
        data['Subsidary FIO'] = excelData.subFioName;
        data[isBMLogin ? 'Status By FIO' : 'Status By BM'] = isBMLogin ? excelData.statusName : excelData.bmStatusName;
        data['Digital Signature Status'] = excelData.digitalSignatureStatus == 17 ? 'E-sign Pending' : excelData.digitalSignatureStatus == 18 ? 'E-sign Completed' : '-';
        return data;
    }
}