function changeQuantity(proId, count) {
    $.ajax({
        url: '/changeQuantity',
        data: {
            product: proId,
            count: count
        },
        method: 'post',
        success: (response) => {
            let price = $('#price' + proId).html().replace(/^\D+/g, '');
            let productCount = $('#quantity' + proId).val();
            $('#productTotal' + proId).html('₹' + productCount * price);

            let current_subTotal = $('#subtotal').html().replace(/^\D+/g, '');
            current_subTotal = parseInt(current_subTotal);
            $('#subtotal').html('₹' + (current_subTotal + (count * price)))

            let shipping_Cost = 0;
            if (current_subTotal < 20000) {
                $('#shippingcost').html('₹50');
                shipping_Cost = 50;
            } else {
                $('#shippingcost').html('₹0');
                shipping_Cost = 0;
            }

            let currentTotal = $('#subtotal').html().replace(/^\D+/g, '');
            currentTotal = parseInt(currentTotal);
            $('#total').html('₹' + (currentTotal + shipping_Cost));
        }
    })
}

function removeFromCart(productId) {
    $.ajax({
        url: '/removeFromCart',
        data: {
            productId: productId
        },
        method: 'post',
        success: (response) => {
            location.reload();
        },
        error: () => {
            alert('Error occured');
        }
    })
}

let count = 0;

$('#couponForm').submit((e) => {
    e.preventDefault();
    $.ajax({
        url: '/applyCoupon',
        method: 'post',
        data: $('#couponForm').serialize(),
        success: (result) => {
            if (result) {
                if (count == 0) {
                    count = 1;
                    let shipping_Cost = 0;
                    let currentSubTotal = parseInt($('#subtotal').html().replace(/^\D+/g, ''));
                    console.log(currentSubTotal);
                    if (currentSubTotal < 20000) {
                        $('#shippingcost').html('₹50');
                        shipping_Cost = 50;
                    } else {
                        $('#shippingcost').html('₹0');
                        shipping_Cost = 0;
                    }

                    $('#invalidCoupon').addClass('d-none');
                    $('#couponApplied').removeClass('d-none');
                    let discount = result.discountPercentage;
                    let subTotal = $('#subtotal').html().replace(/^\D+/g, '');
                    let discountPrice = Math.round(subTotal * discount / 100);
                    subTotal = subTotal - discountPrice;
                    $('#discount').removeClass('d-none');
                    $('#discountPrice').removeClass('d-none');
                    $('#discountPrice').html('₹' + discountPrice);
                    $('#total').html('₹' + (subTotal + shipping_Cost));
                }
            } else {
                $('#invalidCoupon').removeClass('d-none');
                $('#couponApplied').addClass('d-none');
            }
        }
    })
})

function proceedtoCheckout() {
    let total = document.getElementById('total').innerHTML;

    $.ajax({
        url: '/proceedtoCheckout',
        method: 'post',
        data: {
            total: total
        },
        success: (response) => {
            location.href = '/checkout'
        }
    })
}