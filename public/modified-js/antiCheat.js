//Prevent right click
document.oncontextmenu = e => {
    e.preventDefault();
  }
  
  document.onkeydown = e => {
    //Prevent F12 Key
    if(e.key === "F12") {
      alert("Don't try to inspect element!")
      return false;
    }
    //Prevent Ctrl + U
    if(e.ctrlKey && e.key === "u") {
      alert("Don't try to view page sources")
      return false;
    }
    //Prevent Ctrl + C
    if(e.ctrlKey && e.key === "c") {
      alert("Don't try to copy page element")
      return false;
    }
    //Prevent Ctrl + X
    if(e.ctrlKey && e.key === "x") {
      alert("Don't try to cut page element")
      return false;
    }
    //Prevent Ctrl + V
    if(e.ctrlKey && e.key === "v") {
      alert("Don't try to paste page element")
      return false;
    }
  }
  
  
