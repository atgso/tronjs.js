(function(A){if(typeof exports=="object"||typeof exports==="function"&&typeof module=="object"){module.exports=A()}else{if(typeof define=="function"&&define.amd){return define([],A)}else{window.Pack=A()}}})(function(){var A=new Class(function(){this.object=new ActiveXObject("Adodb.Stream");this.fso=new ActiveXObject("Scripting.FileSystemObject");this.fileListInfo=""});A.add("doPack",function(C,E){this.object.Type=1;this.object.Mode=3;this.object.Open();this.object.Position=0;C=C.replace(/\\$/,"");var F=this.getFileList(C);if(F.length==0){return}this.fileListInfo=C.split("\\").reverse()[0]+"|"+this.fileListInfo.split(C+"\\").join("").replace(C,"");this.fileListInfo=this.fileListInfo.replace("||","|");this.setHeaderInfo(this.fileListInfo);for(var B=0;B<F.length;B++){var D=F[B].split(">")[0];this.AppendFile(D)}this.object.SaveToFile(E,2);this.object.Close();this.object=null});A.add("getFileList",function(B){B=B.replace(/\\$/,"");var D=fs(B,true).exist().dirs(function(F){return B+"\\"+F}).then().fail().stop().value();var E=this.fileList(B,function(F){return B+"\\"+F+">"+this.Size});if(E.length==0){this.fileListInfo+=B+"|"}else{this.fileListInfo+=E.join("|")+"|"}if(D.length!=0){for(var C=0;C<D.length;C++){E=E.concat(this.getFileList(D[C]))}}return E});A.add("fileList",function(H,B){var E=this.fso.GetFolder(H),D=E.Files,C=new Enumerator(D),G=[];for(;!C.atEnd();C.moveNext()){var F=C.item().Name;if(typeof B==="function"){F=B.call(C.item(),F);if(F){G.push(F)}}else{G.push(F)}}return G});A.add("AppendFile",function(D){var B=new ActiveXObject("Adodb.Stream"),C=D;B.Type=1;B.Mode=3;B.Open();B.LoadFromFile(C);this.object.Position=this.object.Size;if(B.Size!=0){this.object.Write(B.Read)}B.Close();B=null});A.add("setHeaderInfo",function(D){var B="00000000"+this.getStrSize(D).toString();var E="SPK "+B.substr(B.length-8)+" 00 "+D+" ";var C=new ActiveXObject("Adodb.Stream");C.Type=2;C.Open();C.Charset="utf-8";C.Position=0;C.WriteText=E;C.Position=3;C.CopyTo(this.object);C.Close();C=null});A.add("getStrSize",function(C){var B=new ActiveXObject("Adodb.Stream"),D;B.Type=2;B.Open();B.Charset="utf-8";B.Position=0;B.WriteText=C;D=B.Size-3;B.Close();B=null;return D});A.add("unPack",function(K,L){this.object.Type=1;this.object.Mode=3;this.object.Open();this.object.Position=0;this.object.LoadFromFile(K);this.binary=this.object.Read();L=L.replace(/\\$/,"");var C=this.getHeaderInfo(K),J=C.substr(0,8),G=C.substr(12);var F=G.split("|"),M=16+Number(J)+1;var B=L;this.autoCreateFolder(B);for(var I=1;I<F.length-1;I++){if(F[I].indexOf(">")==-1){this.autoCreateFolder(B+"\\"+F[I])}else{var E=F[I].split(">"),H=E[0],D=Number(E[1]),N=B+"\\"+H;this.autoCreateFolder(N.split("\\").slice(0,-1).join("\\"));if(D==0){this.fso.CreateTextFile(N,true)}else{this.SaveFile(M,D,N);M+=D}}}});A.add("getHeaderInfo",function(E){var C=new ActiveXObject("Adodb.Stream"),D;C.Type=2;C.Open();C.Charset="utf-8";C.LoadFromFile(E);C.Position=4+3;var B=Number(C.ReadText(8));C.Position=4+3;D=C.ReadText(12+B);C.Close();C=null;return D});A.add("SaveFile",function(E,B,F){var C=new ActiveXObject("Adodb.Stream"),D=F;C.Type=1;C.Mode=3;C.Open();this.object.Position=E;this.object.CopyTo(C,B);C.SaveToFile(D,2);C.Close();C=null});A.add("autoCreateFolder",function(F){var C=Server.MapPath("/"),D=F.replace(C,""),E=D.replace(/^\\/,"").split("\\");for(var B=0;B<E.length;B++){C+="\\"+E[B];if(!this.fso.FolderExists(C)){this.fso.CreateFolder(C)}}return this.fso.FolderExists(F)});A.add("readpbd",function(B,I){I=I.replace(/\//ig,"\\");this.object.Type=1;this.object.Mode=3;this.object.Open();this.object.Position=0;this.object.LoadFromFile(B);this.binary=this.object.Read();var L=this.getHeaderInfo(B),J=L.substr(0,8),F=L.substr(12);var N="";var E=F.split("|"),K=16+Number(J)+1;for(var H=1;H<E.length-1;H++){if(E[H].indexOf(">")>-1){var D=E[H].split(">"),G=D[0],C=Number(D[1]);if(G===I){if(C===0){return N}else{var M=new ActiveXObject("Adodb.Stream");M.Type=1;M.Open();this.object.Position=K;this.object.CopyTo(M,C);M.Position=0;M.Type=2;M.Charset="utf-8";N=M.ReadText();M.Close();M=null;return N}}K+=C}}return"未找到目标文件"});return A});