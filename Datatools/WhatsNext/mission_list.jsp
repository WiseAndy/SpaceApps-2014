<%@ page import="java.util.List, whatsnext.dao.*, whatsnext.bean.*"
	language="java" contentType="text/html; charset=US-ASCII"
	pageEncoding="US-ASCII"%>
<%
	List<Mission> list = MissionDao.getAllMissionList();
%>
<select id="mission_list">
	<%
		for (Mission mission : list) {
	%>
	<option value="<%=mission.getValue(Mission.NAME)%>"><%=mission.getValue(Mission.NAME)%> year: <%=mission.getValue(Mission.YEAR)%></option>
		<%
			}
		%>
	
</select>