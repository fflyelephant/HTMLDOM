function XmlDocument(){
	this.xmldom = "";
}
XmlDocument.prototype = {
	/*创建用于IE的ActiveXObject对象*/
	CreateActiveObj: function(){
		var activeXString = "";
		var ActiveXObjversions = ["MSXML2.DOMDocument.6.0","MSXML2.DOMDocument.3.0","MSXML2.DOMDocument"];
		for(var i=0;i<ActiveXObjversions.length;i++)
		{
			try{
				new ActiveXObject(ActiveXObjversions[i]);
			    	activeXString = ActiveXObjversions[i];
				break;
			}catch(ex){
				alert("Can not create ActiveObj: " + ActiveXObjversions[i]);
			}
		}
		return new ActiveXObject(ActiveXObjversions[i]);
	},
	/*加载XML外部文件方法*/
	LoadXMLfile: function(filePath){
		/*使用'"ActiveXObject" in window' 判断是否是IE浏览器*/
		if("ActiveXObject" in window)
		{//for IE
			this.xmldom = this.CreateActiveObj();
		}
		else 
		{//for others
			this.xmldom = document.implementation.createDocument("","",null);
		}
		this.xmldom.async = false;
		this.xmldom.load(filePath);
		return new handler_dom(this.xmldom);
	},
	/*加载XML数据方法*/
	LoadXMLtext: function(xmltext){
		var parser = new DOMParser();
		this.xmldom = parser.parseFromString(xmltext,"text/xml");
		return new handler_dom(this.xmldom);
	},
	/*序列化dom方法*/
	Serialize: function(domObj){
		var xmlString;
		xmlString = (new XMLSerializer()).serializeToString(domObj);	
		return xmlString;
	}
};

/*操作DOM元素*/
function handler_dom(dom){
	this.dom = dom;
}
handler_dom.prototype = {
	/*获取节点值,没有文本节点返回空*/
	GetDOMNodeValue: function(node){
		if(node.hasChildNodes())
			return node.firstChild.nodeValue;
			//return node.childNodes[0].nodeValue
		else
			return "";
	},
	/*设置节点值,没有文本节点就创建文本节点并appendChild*/
	SetDOMNodeValue: function(node,value){
		if(node.hasChildNodes())
			node.firstChild.nodeValue = value;
		else
		{
			var textNode = document.createTextNode(value);
			node.appendChild(textNode);
		}
	},
	/*查找path节点*/
	Find: function(path,currentNode){
		var currentNode = this.dom;
		var token = path.split("/");	
		var seq = 0;
		var _Success;
		for(var i=0;i<token.length;i++)
		{
			_Success = false;
			for(var j=0;j<currentNode.childNodes.length;j++)
			{
				if(token[i] == currentNode.childNodes[j].nodeName)
				{
					currentNode = currentNode.childNodes[j];
					seq++;
					_Success = true;
					break;
				}
			}
			if(_Success)
			{
				if(seq == token.length)
					break;
				else
					continue;
			}				
			else
			{
				currentNode = null;
				break;
			}
		}
		return currentNode;
	},
	/*获取节点值*/
	GetNodeValue: function(path){
		var node = this.Find(path,this.dom);
		if(node)
		{	
			return this.GetDOMNodeValue(node);
		}
		else
			alert("GetNodeValue(Error):no this path!");
	},
	/*设置节点值*/
	SetNodeValue: function(path,value){
		var node = this.Find(path,this.dom)
		if(node)
			this.SetDOMNodeValue(node,value);
		else
			alert("SetNodeValue(Error):no this path!");
	}
};

