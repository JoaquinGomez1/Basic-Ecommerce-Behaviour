        // Selectors 
const sidebarOpenBtn = document.querySelector('.open-sidebar');
const closeSidebarBtn = document.querySelector('.close-sidebar');
const clearSidebarBtn = document.querySelector('.clear-sidebar')
const sidebar = document.querySelector('.sidebar');
const cards = document.querySelectorAll('.card');
const sidebarUl = document.querySelector('.sidebar-ul');
const inCartCounter = document.querySelectorAll('.items-in-cart');
const shoppingGallery = document.querySelector('.row');

        // Variables
let shoppingCartElements = []
let addedItems = []
let allAvailableProducts = []


        // Event listeners
sidebarOpenBtn.addEventListener('click', showSidebar);
closeSidebarBtn.addEventListener('click', closeSidebar);
clearSidebarBtn.addEventListener('click', clearSidebar);
window.addEventListener('click', (e) => e.target == document.querySelector('.sidebar') ? closeSidebar() : null)
window.addEventListener('load', renderArticles);

        //---------------↓--------Functions---------↓-----------
        
function showSidebar(){
    sidebar.style.display = 'block'
    renderShoppingCartItems();
}

function closeSidebar(){
    sidebar.style.display = 'none'
}

function clearSidebar(){
    shoppingCartElements = [];
    addedItems = [];
    sidebarUl.innetHTML = '';
    updateShoppingCounter();
    reRenderSidebar();
}

function reRenderSidebar(){
    //This function only works because 'showSideBar' renders the sidebar's content 
    //before showing it to the user
    closeSidebar();
    showSidebar();
}

function addItemToShoppingCart(e){
    const childs = e.currentTarget.childNodes;
    console.log(childs)

    if(addedItems.includes(e.currentTarget)){
        let index = addedItems.indexOf(e.currentTarget)
                // Increase amount of repeated elements by 1.
        shoppingCartElements[index].ammount++;

    }else{
        const item = {
            img:childs[0].src,
            name:childs[1].firstChild.data,
            price:childs[2].firstChild.data.replace('$', ''),
            ammount:1
        }
        addedItems.push(e.currentTarget);
        shoppingCartElements.push(item);
        updateShoppingCounter();
    }
}

function renderShoppingCartItems(){
    sidebarUl.innerHTML = '';

    shoppingCartElements.forEach(elem => {
        const newCard = createNewCard(elem, 'sidebar')
        sidebarUl.appendChild(newCard);
    })
    const totalPriceElement = document.querySelector('.total-price');
    const totalPriceAmount = calculateShoppingListTotal();

    totalPriceElement.innerHTML = `Check Out Price: $${totalPriceAmount}`;
}

function renderArticles(){
    fetch('./content.json')
    .then(res => res.json())
    .then(data => data.forEach(elem => {
        const item = createNewCard(elem)
        item.addEventListener('click', addItemToShoppingCart)
        shoppingGallery.appendChild(item)
            
            // Add every element in the json file to the list of available products
        allAvailableProducts.push(elem)
    }))
}

function calculateShoppingListTotal(){
    let totalAmount = 0;
    shoppingCartElements.forEach(elem => {
        totalAmount += elem.price * elem.ammount;
        console.log(elem.price)
    })

    return totalAmount
}

function updateShoppingCounter(){
    let itemsInCartAmount = shoppingCartElements.length;
    inCartCounter.forEach(elem => {
        elem.innerHTML = itemsInCartAmount;
        if(itemsInCartAmount == 0){
            elem.style.display = 'none'
        }else{
            elem.style.display = 'inline-block'
        }
    })
}

function createNewCard(elem, where){
    const newCard = document.createElement('div');
    newCard.classList.add('card')
    newCard.classList.add('shadow');
    newCard.classList.add('mb-4');

    const nodeImg = document.createElement('img')
    nodeImg.src = elem.img

    const nodeH3 = document.createElement('h3');
    nodeH3.classList.add('text-center');
    nodeH3.classList.add('mt-4');
    nodeH3.innerText = elem.name;

    const nodePrice = document.createElement('p');
    nodePrice.innerText = `$${elem.price}` ;

    const nodeAmmount = document.createElement('p');
    nodeAmmount.innerText = elem.ammount;

    newCard.appendChild(nodeImg);
    newCard.appendChild(nodeH3);
    newCard.appendChild(nodePrice);

    where == 'sidebar'  ?  newCard.appendChild(nodeAmmount) : null ;


    return newCard
}