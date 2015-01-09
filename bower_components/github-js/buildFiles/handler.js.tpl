    var <%= sectionName%><%= funcName%>AfterRequest = function(ret, res){
<%= afterRequest %>
        };
    <%= sectionName%>.<%= funcName%> = handler(<%= sectionName%><%= funcName%>AfterRequest);