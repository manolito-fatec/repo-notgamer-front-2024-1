<template>
    <div class ="icon-out"></div>
</template>

<style>
.icon-out{
    border-color: red;
    border-right-style: solid;
    border-top-style: solid;
    transform: rotate(-135deg);
    width: 10px;
    height: 10px;
    border-width: 3px;
}

.icon-out:hover::after {
    content: 'Saiu';
    position:absolute;
    background-color: #0000005e;
    left: 150%;
    top: 100%;
    font-size: 9px;
    color: white;
    padding: 2px;
    border-radius: 3px;
    transform: rotate(135deg);
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