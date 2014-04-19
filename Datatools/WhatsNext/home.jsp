<%@ page language="java" import="java.util.*,whatsnext.bean.Mission" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%Mission mission = (Mission)request.getAttribute("mission"); %>    
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
</head>
<body>
<div >
<form action='<%=request.getContextPath() %>/MissionJsonServlet' method='post'>
<ul>
<%
	Mission m = new Mission();
	m.setValue(Mission.NAME, "test");
	
	String name = (String) m.getValue(Mission.NAME);
	String year = (String) m.getValue(Mission.YEAR);
	String agency = (String) m.getValue(Mission.AGENCY);
	String launch_site = (String) m.getValue(Mission.LAUNCH_SITE);
	String type = (String) m.getValue(Mission.TYPE );
	String earth_weight = (String) m.getValue(Mission.EARTH_WEIGHT);
	String size = (String) m.getValue(Mission.SIZE );
	String key_images = (String) m.getValue(Mission.KEY_IMAGES);
	String images = (String) m.getValue(Mission.IMAGES );
	String key_findings = (String) m.getValue(Mission.KEY_FINDINGS);
	String enabling_technologies = (String) m.getValue(Mission.ENABLING_TECHNOLOGIES);
	String problems = (String) m.getValue(Mission.PROBLEMS);
	String start_date = (String) m.getValue(Mission.START_DATE);
	String end_date = (String) m.getValue(Mission.END_DATE );
	String sister_missions = (String) m.getValue(Mission.SISTER_MISSIONS);
	String related_missions = (String) m.getValue(Mission.RELATED_MISSIONS);
	String music = (String) m.getValue(Mission.MUSIC);
	String more_info = (String) m.getValue(Mission.MORE_INFO);
%>
	<li>Name: <input type="text" name="<%=Mission.NAME%>"value=<%= name == null ? "" : name %>> </li>
	<li>year: <input type="text" name="<%=Mission.YEAR%>" value=<%= year == null ? "" : year%>> </li>
	<li>agency: <input type="text" name="<%=Mission.AGENCY%>" value=<%= agency == null ? "" : agency%>> </li>
	<li>launch_site: <input type="text" name="<%=Mission.LAUNCH_SITE%>" value=<%= launch_site == null ? "" : launch_site%>> </li>
	<li>type: <input type="text" name="<%=Mission.TYPE%>" value=<%= type == null ? "" : type%>> </li>
	<li>earth_weight: <input type="text" name="<%=Mission.EARTH_WEIGHT%>" value=<%= earth_weight == null ? "" : earth_weight%>> </li>
	<li>size: <input type="text" name="<%=Mission.SIZE%>" value=<%= size == null ? "" : size%>> </li>
	<li>key_images: <input type="text" name="<%=Mission.KEY_IMAGES%>" value=<%= key_images == null ? "" : key_images%>> </li>
	<li>images: <input type="text" name="<%=Mission.IMAGES%>" value=<%= images == null ? "" : images%>> </li>
	<li>key_findings: <input type="text" name="<%=Mission.KEY_FINDINGS%>" value=<%= key_findings == null ? "" : key_findings%>> </li>
	<li>enabling_technologies: <input type="text" name="<%=Mission.ENABLING_TECHNOLOGIES%>" value=<%= enabling_technologies == null ? "" : enabling_technologies%>> </li>
	<li>problems: <input type="text" name="<%=Mission.PROBLEMS%>" value=<%= problems == null ? "" : problems%>> </li>
	<li>start_date: <input type="text" name="<%=Mission.START_DATE%>" value=<%= start_date == null ? "" : start_date%>> </li>	
	<li>end_date: <input type="text" name="<%=Mission.END_DATE%>" value=<%= end_date == null ? "" : end_date%>> </li>
	<li>sister_missions: <input type="text" name="<%=Mission.SISTER_MISSIONS%>" value=<%= sister_missions == null ? "" : sister_missions%>> </li>
	<li>related_missions: <input type="text" name="<%=Mission.RELATED_MISSIONS%>" value=<%= related_missions == null ? "" : related_missions%>> </li>
	<li>music: <input type="text" name="<%=Mission.MUSIC%>" value=<%= music == null ? "" : music%>> </li>
	<li>more_info: <input type="text" name="<%=Mission.MORE_INFO%>" value=<%= more_info == null ? "" : more_info%>> </li>
	<li><input type="submit" value="submit"></li>
</ul> 

</form>
</div>
</body>
</html>