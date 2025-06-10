<script>
  // --- Helper function to get selected radio button value ---
  function getCheckedRadioValue(name) {
      const radios = document.getElementsByName(name);
      for (let i = 0; i < radios.length; i++) {
          if (radios[i].checked) {
              return radios[i].value;
          }
      }
      return null; // No radio button checked
  }

  // --- Feedback Submission Function ---
  // This function handles the feedback for each product independently
  function submitFeedback(productName, ratingId, commentId, displayListId) {
      const rating = document.getElementById(ratingId).value;
      const comment = document.getElementById(commentId).value;
      const feedbackList = document.getElementById(displayListId);

      if (!rating && !comment.trim()) {
          alert('Please select a rating or enter a comment.');
          return;
      }

      const newFeedback = document.createElement("li");
      newFeedback.innerHTML = `<strong>${productName}</strong> - ${rating ? "⭐".repeat(parseInt(rating)) : 'No Rating'}<br><em>${comment.trim() || 'No comment provided.'}</em>`;
      feedbackList.appendChild(newFeedback);

      // Clear the form fields for this specific product's feedback
      document.getElementById(ratingId).value = '';
      document.getElementById(commentId).value = '';
      alert(`Feedback for ${productName} submitted!`);
  }

  // --- Main Order Calculation & Storage Function ---
  // This function is called to calculate the total and prepare order details.
  function calculateTotal() {
    let subTotal = 0;
    const orderedItems = []; // Array to store details of each ordered item

    // --- Hookah ---
    const hookahFlavourSelect = document.getElementById("hookahFlavour");
    // Ensure that hookahFlavourSelect is not null and has a value
    const hookahFlavour = hookahFlavourSelect ? hookahFlavourSelect.value : "None";
    const hookahBasePrice = 400; // Base price for any selected hookah flavor
    let currentHookahTotal = 0;

    if (hookahFlavour !== "None") {
      currentHookahTotal += hookahBasePrice;
      orderedItems.push({ name: `Hookah (${hookahFlavour})`, price: hookahBasePrice, qty: 1 });
    }

    const extraHookah = document.getElementById("hookahExtra").checked;
    if (extraHookah) {
      currentHookahTotal += 50;
      orderedItems.push({ name: "Hookah Extra Coal & Paper", price: 50, qty: 1 });
    }

    const extraHours = parseInt(document.getElementById("extraHookahHours").value || 0);
    if (extraHours > 0) {
      const extraHoursCost = extraHours * 100;
      currentHookahTotal += extraHoursCost;
      orderedItems.push({ name: `Hookah Extra Hours (${extraHours} hrs)`, price: extraHoursCost, qty: 1 });
    }
    subTotal += currentHookahTotal; // Add calculated hookah price to total


    // --- Simple Momo ---
    const simpleMomoQty = parseInt(document.getElementById("simpleMomoQty").value || 0);
    const simpleMomoSize = getCheckedRadioValue('simple_momo_size');
    if (simpleMomoQty > 0 && simpleMomoSize) {
      const momoPricePerPlate = simpleMomoSize === "half" ? 60 : 120;
      const itemTotal = momoPricePerPlate * simpleMomoQty;
      subTotal += itemTotal;
      orderedItems.push({ name: `Simple Momo (${simpleMomoSize})`, price: momoPricePerPlate, qty: simpleMomoQty });
    }

    // --- Jhol Momo ---
    const jholMomoQty = parseInt(document.getElementById("jholMomoQty").value || 0);
    const jholMomoSize = getCheckedRadioValue('jhol_momo_size');
    if (jholMomoQty > 0 && jholMomoSize) {
      const jholPricePerPlate = jholMomoSize === "half" ? 99 : 199;
      const itemTotal = jholPricePerPlate * jholMomoQty;
      subTotal += itemTotal;
      orderedItems.push({ name: `Jhol Momo (${jholMomoSize})`, price: jholPricePerPlate, qty: jholMomoQty });
    }

    // --- Coffee ---
    const englishCoffeeQty = parseInt(document.getElementById("englishCoffeeQty").value || 0);
    if (englishCoffeeQty > 0) {
      subTotal += 80 * englishCoffeeQty;
      orderedItems.push({ name: "English Coffee", price: 80, qty: englishCoffeeQty });
    }
    const plainCoffeeQty = parseInt(document.getElementById("plainCoffeeQty").value || 0);
    if (plainCoffeeQty > 0) {
      subTotal += 80 * plainCoffeeQty;
      orderedItems.push({ name: "Plain Coffee", price: 80, qty: plainCoffeeQty });
    }

    // --- Noodles ---
    const noodlesQty = parseInt(document.getElementById("noodlesQty").value || 0);
    const noodlesSize = getCheckedRadioValue('noodles_size');
    if (noodlesQty > 0 && noodlesSize) {
      const noodlesPricePerPlate = noodlesSize === "half" ? 80 : 150;
      const itemTotal = noodlesPricePerPlate * noodlesQty;
      subTotal += itemTotal;
      orderedItems.push({ name: `Noodles (${noodlesSize})`, price: noodlesPricePerPlate, qty: noodlesQty });
    }

    // --- Tea ---
    const normalChaiQty = parseInt(document.getElementById("normalChaiQty").value || 0);
    if (normalChaiQty > 0) {
      subTotal += 15 * normalChaiQty;
      orderedItems.push({ name: "Normal Chai", price: 15, qty: normalChaiQty });
    }
    const tandooriChaiQty = parseInt(document.getElementById("tandooriChaiQty").value || 0);
    if (tandooriChaiQty > 0) {
      subTotal += 30 * tandooriChaiQty;
      orderedItems.push({ name: "Tandoori Chai", price: 30, qty: tandooriChaiQty });
    }
    const blackTeaQty = parseInt(document.getElementById("blackTeaQty").value || 0);
    if (blackTeaQty > 0) {
      subTotal += 30 * blackTeaQty;
      orderedItems.push({ name: "Black Tea", price: 30, qty: blackTeaQty });
    }

    // Show Total on this page
    document.getElementById("total").textContent = subTotal.toFixed(2);

    // Store order details in localStorage for the order-summary page
    localStorage.setItem('orderDetails', JSON.stringify({
      items: orderedItems,
      subTotal: subTotal.toFixed(2)
    }));

    console.log("Order details stored:", orderedItems, "Subtotal:", subTotal);
  }

  // --- Event Listeners for Dynamic Calculation ---
  const mainOrderForm = document.getElementById("mainOrderForm");

  // Listen for 'change' events (for select, radio, checkbox) and 'input' events (for text/number inputs)
  // This will trigger calculateTotal() every time a relevant field changes.
  mainOrderForm.addEventListener('change', calculateTotal);
  mainOrderForm.addEventListener('input', calculateTotal);

  // Initial calculation when the page loads, in case there are default selections
  document.addEventListener('DOMContentLoaded', calculateTotal);


  // --- Form Submission Listener (Redirects to Order Summary) ---
  mainOrderForm.addEventListener("submit", function(event) {
      // Prevent default form submission to manually handle redirection after storing data
      event.preventDefault();

      // Ensure the latest total and items are stored before redirecting
      calculateTotal();

      // Redirect to the order summary page
      window.location.href = this.action; // Redirects to 'order-summary.html' as defined in form action
  });
</script>