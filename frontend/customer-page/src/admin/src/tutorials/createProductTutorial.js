export function getCreateProductTutorialSteps(tour) {
    return [
        {
            id: 'step-name',
            text: 'Let’s start by entering the product name.',
            attachTo: { element: '.shepherd-product-name', on: 'bottom' },
            buttons: [
                {
                    text: 'Next',
                    action: () => tour.next()
                }
            ]
        },
        {
            id: 'step-category',
            text: 'Now enter a category for your product.',
            attachTo: { element: '.shepherd-product-category', on: 'bottom' },
            buttons: [
                {
                    text: 'Next',
                    action: () => tour.next()
                }
            ]
        },
        {
            id: 'step-description',
            text: 'Add a description here.',
            attachTo: { element: '.shepherd-product-description', on: 'bottom' },
            buttons: [
                {
                    text: 'Next',
                    action: () => tour.next()
                }
            ]
        },
        {
            id: 'step-price',
            text: 'Set a price for your product.',
            attachTo: { element: '.shepherd-product-price', on: 'bottom' },
            buttons: [
                {
                    text: 'Next',
                    action: () => tour.next()
                }
            ]
        },
        {
            id: 'step-image',
            text: 'Upload a product image here.',
            attachTo: { element: '.shepherd-product-image', on: 'bottom' },
            buttons: [
                {
                    text: 'Next',
                    action: () => tour.next()
                }
            ]
        },
        {
            id: 'step-quantity',
            text: 'Use these buttons to adjust the quantity.',
            attachTo: { element: '.shepherd-product-quantity', on: 'top' },
            buttons: [
                {
                    text: 'Next',
                    action: () => tour.next()
                }
            ]
        },
        /*
        {
            id: 'step-submit',
            text: 'Click here to submit the product.',
            attachTo: { element: '.shepherd-submit', on: 'top' },
            buttons: [
                {
                    text: 'Submit',
                    action: () => {
                        document.querySelector('.shepherd-submit')?.click();
                        tour.next();
                    }
                }
            ]
        },
        */
        {
            id: 'step-submit',
            text: 'Click the "Create Product" button to submit your product.',
            attachTo: { element: '.shepherd-product-submit', on: 'top' },
            advanceOn: { selector: '.shepherd-product-submit', event: 'click' },
            buttons: [] // Don't render custom buttons
        },
        {
            id: 'step-complete',
            text: '🎉 Congratulations! You’ve successfully created a product.',
            buttons: [
                {
                    text: 'Finish',
                    action: () => tour.complete()
                }
            ]
        }
    ];
}







/*
export const createProductTutorialSteps = [
    {
        id: 'step-name',
        text: 'Let’s start by entering the product name.',
        attachTo: { element: '.shepherd-product-name', on: 'bottom' },
        buttons: [
            {
                text: 'Next',
                action() {
                    this.tour.next();
                }
            }
        ]
    },
    {
        id: 'step-category',
        text: 'Now enter a category for your product.',
        attachTo: { element: '.shepherd-product-category', on: 'bottom' },
        buttons: [
            {
                text: 'Next',
                action() {
                    this.tour.next();
                }
            }
        ]
    },
    {
        id: 'step-description',
        text: 'Add a description here.',
        attachTo: { element: '.shepherd-product-description', on: 'bottom' },
        buttons: [
            {
                text: 'Next',
                action() {
                    this.tour.next();
                }
            }
        ]
    },
    {
        id: 'step-price',
        text: 'Set a price for your product.',
        attachTo: { element: '.shepherd-product-price', on: 'bottom' },
        buttons: [
            {
                text: 'Next',
                action() {
                    this.tour.next();
                }
            }
        ]
    },
    {
        id: 'step-image',
        text: 'Upload a product image here.',
        attachTo: { element: '.shepherd-product-image', on: 'bottom' },
        buttons: [
            {
                text: 'Next',
                action() {
                    this.tour.next();
                }
            }
        ]
    },
    {
        id: 'step-quantity',
        text: 'Use these buttons to adjust the quantity.',
        attachTo: { element: '.shepherd-increment', on: 'top' },
        buttons: [
            {
                text: 'Next',
                action() {
                    this.tour.next();
                }
            }
        ]
    },
    {
        id: 'step-submit',
        text: 'Click here to submit the product.',
        attachTo: { element: '.shepherd-submit', on: 'top' },
        buttons: [
            {
                text: 'Submit',
                action() {
                    document.querySelector('.shepherd-submit').click(); // trigger form submit
                    this.tour.next();
                }
            }
        ]
    },
    {
        id: 'step-complete',
        text: '🎉 Congratulations! You’ve successfully created a product.',
        buttons: [
            {
                text: 'Finish',
                action() {
                    this.tour.complete();
                }
            }
        ]
    }
];
*/