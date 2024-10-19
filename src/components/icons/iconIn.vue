<template>
    <button class ="icon-in"></button>
</template>
<style>
.icon-in{
    border-color: #24FF00;
    border-right-style: solid;
    border-top-style: solid;
    transform: rotate(45deg);
    width: 10px;
    height: 10px;
    border-width: 3px;   
}
.icon-in:hover::after {
    content: 'Entrou';
    position:absolute;
    background-color: #0000005e;
    right: 0%;
    bottom: 150%;
    font-size: 9px;
    color: white;
    padding: 2px;
    border-radius: 3px;
    transform: rotate(-45deg);
    animation-duration: 300ms;
    animation-name: animation-popup;    
}

@keyframes animation-popup {
  from {
    font-size: 0px;
    background-color: #00000000;
  }

  to {
    font-size: 9px;
    background-color: #0000005e;
  }
}
</style>