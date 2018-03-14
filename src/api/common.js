export function _timestrToDate(str){
    	var date = new Date(str);
    	var Y = date.getFullYear();
    	var m = date.getMonth()+1;
    	m = _timeFormat(m);
    	var d = date.getDate();
    	d = _timeFormat(d);
    	var H = date.getHours();
    	H = _timeFormat(H);
    	var s = date.getMinutes();
    	s = _timeFormat(s);
    	var i = date.getSeconds();
    	i = _timeFormat(i);
    	var time = Y+'-'+m+'-'+d+' '+H+':'+s+':'+i;
    	return time;
    }
export function _timestrToHs(str){
        var date = new Date(str);
        var Y = date.getFullYear();
        var m = date.getMonth()+1;
        m = _timeFormat(m);
        var d = date.getDate();
        d = _timeFormat(d);
        var H = date.getHours();
        H = _timeFormat(H);
        var s = date.getMinutes();
        s = _timeFormat(s);
        var i = date.getSeconds();
        i = _timeFormat(i);
        var time = H+':'+s;
        return time;
    }
function _timeFormat(d){
	var newD = d.toString().length==1 ? '0'+d : d;
	return newD;
}