const PdfPrinter = require('pdfmake');


exports.generatePdf = async (res, data) => {
    res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Access-Control-Allow-Origin': '*',
        'Content-Disposition': 'attachment; filename=Untitled.pdf',
    });
    const fonts = {
        Courier: {
            normal: 'Courier',
            bold: 'Courier-Bold',
            italics: 'Courier-Oblique',
            bolditalics: 'Courier-BoldOblique',
        },
        Helvetica: {
            normal: 'Helvetica',
            bold: 'Helvetica-Bold',
            italics: 'Helvetica-Oblique',
            bolditalics: 'Helvetica-BoldOblique',
        },
        Times: {
            normal: 'Times-Roman',
            bold: 'Times-Bold',
            italics: 'Times-Italic',
            bolditalics: 'Times-BoldItalic',
        },

    };
    let transform = [];
    transform.push([
        { text: 'Titulo', bold: true, alignment: 'center' },
        { text: 'Modelo', bold: true, alignment: 'center' },
        { text: 'Sku', bold: true, alignment: 'center' },
        { text: 'Categoria', bold: true, alignment: 'center' },
        { text: 'Precio', bold: true, alignment: 'center' }
    ])
    data.map(p => {
        transform.push([
            p.title,
            p.model,
            p.sku,
            p['Category.name'],
            { text: Number(p.price).toLocaleString("es-CO", { minimumFractionDigits: 2 }), alignment: 'center' }
        ])
    })
    let totals = await data.reduce((acc, p) => Number(acc) + Number(p.price), 0)

    transform.push([{ text: 'Total', colSpan: 4, bold: true, alignment: 'center' }, {}, {}, {}, { text: totals.toLocaleString("es-CO", { minimumFractionDigits: 2 }), bold: true, alignment: 'center' }])
    const docDefinition = {
        content: [
            { text: 'Reporte de Productos', style: 'subheader', fontSize: 18, bold: true, margin: [0, 0, 0, 10] },

            {
                style: 'tableExample',
                table: {
                    widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
                    body: transform
                }
            },
        ],
        defaultStyle: {
            font: 'Helvetica',
        },
        styles: {
            filledHeader: {
                bold: true,
                fontSize: 14,
                color: 'white',
                fillColor: 'black',
                alignment: 'center',
            },
        },
    };
    const printer = new PdfPrinter(fonts);
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(res);
    pdfDoc.end();
};
