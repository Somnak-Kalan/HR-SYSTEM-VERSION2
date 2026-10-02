import * as ExcelJS from 'exceljs';

const ExportExcelFile = (getDetailData, totalCount) => {
  const {
    headers2 = [],
    data = [],
    fileName = 'No Name',
    form_name_date = {},
    department = '',
    isMultiDepartment = false,
  } = getDetailData;

  const total_count_report = totalCount;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`${form_name_date?.name}`);

  // =========================================================
  // NEW: MULTI DEPARTMENT / SAME SHEET
  // =========================================================
  if (isMultiDepartment) {
    worksheet.mergeCells('A1:I1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = `FINGER PRINT ${form_name_date?.date_name || ''}`;
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'AACC92' },
    };
    titleCell.font = {
      name: 'Times New Roman',
      size: 11,
      bold: true,
    };
    worksheet.getRow(1).height = 22;

    worksheet.columns =
      Array.isArray(headers2) &&
      headers2?.map((header) => ({
        key: header.key,
        width: header.width || 10,
      }));

    // header row
    const headerRowNumber = 2;
    headers2.forEach((header, index) => {
      const cell = worksheet.getCell(headerRowNumber, index + 1);
      cell.value = header.header;
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'AACC92' },
      };
      cell.font = { bold: true, name: 'Times New Roman' };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFFFFF' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } },
      };
    });
    worksheet.getRow(headerRowNumber).height = 20;

    const startDataRow = 3;

    const fmtBorder = {
      top: { style: 'thin', color: { argb: 'FFFFFF' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } },
    };

    data.forEach((row, idx) => {
      const rowNumber = startDataRow + idx;

      // department title row
      if (row?.__rowType === 'department') {
        worksheet.mergeCells(`A${rowNumber}:I${rowNumber}`);
        const cell = worksheet.getCell(`A${rowNumber}`);
        cell.value = `DEPARTMENT : ${department || 'No Department Name'}`;
        cell.font = { name: 'Times New Roman', size: 11, bold: true };
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D9EAD3' },
        };
        cell.border = fmtBorder;
        worksheet.getRow(rowNumber).height = 20;
        return;
      }
      // employee row
      if (row?.__rowType === 'employee') {
        worksheet.mergeCells(`A${rowNumber}:I${rowNumber}`);
        const cell = worksheet.getCell(`A${rowNumber}`);

        cell.value = {
          richText: [
            {
              text: `ID : ${row?.employee_id || ''}    NAME : `,
              font: {
                name: 'Times New Roman',
                size: 11,
                bold: true,
              },
            },
            {
              text: `${row?.name || ''}`,
              font: {
                name: 'Kh Battambang',
                size: 11,
                bold: true,
              },
            },
          ],
        };

        cell.alignment = { horizontal: 'left', vertical: 'middle' };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF2CC' },
        };
        cell.border = fmtBorder;
        worksheet.getRow(rowNumber).height = 20;
        return;
      }
      // normal data row
      headers2?.forEach((header, colIndex) => {
        const cell = worksheet.getCell(rowNumber, colIndex + 1);
        cell.value = row?.[header.key];

        const isKhmer = /[\u1780-\u17FF]/.test(row?.[header?.key] || '');
        if (header?.key === 'name') {
          cell.font = {
            color: { argb: '000000' },
            name: 'Kh Battambang',
            size: 11,
          };
        } else {
          cell.font = {
            color: { argb: '000000' },
            name: isKhmer ? 'Kh Battambang' : 'Times New Roman',
            size: 11,
          };
        }

        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = fmtBorder;
      });

      const specificColumn = headers2?.length;
      for (let columnIndex = 1; columnIndex <= specificColumn; columnIndex++) {
        const cell = worksheet.getCell(rowNumber, columnIndex);
        const cell6 = worksheet.getCell(rowNumber, 6);
        const cell7 = worksheet.getCell(rowNumber, 7);
        const cell8 = worksheet.getCell(rowNumber, 8);
        const cell9 = worksheet.getCell(rowNumber, 9);
        const rowData = row;

        if (rowData?.day === 'Sun') {
          if (
            rowData?.time_check_in ||
            rowData?.time_check_out ||
            department !== 'FCL - SALE (China Warehouse)' ||
            rowData?.value === 'H'
          ) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: '' },
            };
          }
        }

        if (rowData?.day === 'Sun' && rowData?.value !== 'H' && !rowData?.time_check_in && !rowData?.time_check_out) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF00' },
          };
        }

        if (rowData?.time_check_in === undefined || rowData?.time_check_in === '' || rowData?.time_check_in === null) {
          cell6.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF00' },
          };
        }

        if (
          rowData?.time_check_out === undefined ||
          rowData?.time_check_out === '' ||
          rowData?.time_check_out === null
        ) {
          cell7.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF00' },
          };
        }

        if (rowData?.value === 'Sh') {
          cell8.value = '';
        }

        if (rowData?.value === 'Sh' && rowData?.day !== 'Sun' && rowData?.day !== 'Sat') {
          cell9.value = '';
        }
        const text9 = String(rowData?.note ?? cell9.value ?? '');
        const isKhmer9 = /[\u1780-\u17FF]/.test(text9);

        cell9.font = {
          color: { argb: 'FFFF0000' },
          name: isKhmer9 ? 'Kh Battambang' : 'Times New Roman',
          size: isKhmer9 ? 11 : 11,
        };
      }

      const applyConditionalFormatting = (specificColumn) => {
        const cell = worksheet.getCell(rowNumber, specificColumn);
        const rowData = row;

        if (specificColumn === 6) {
          if (
            (rowData?.value === 'H' || (rowData?.value === 'H' && rowData?.day === 'Sun')) &&
            rowData?.value !== 'Sh'
          ) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: '00a300' },
            };
          } else if (rowData?.value === 'Late In') {
            cell.font = {
              color: { argb: 'FF0000' },
              name: 'Times New Roman',
            };
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFF00' },
            };
          } else if (rowData?.value === 'AL1/2') {
            if (rowData?.date_leave?.[0]?.status_request === 'morning') {
              cell.font = {
                color: { argb: 'FF0000' },
                name: 'Times New Roman',
              };
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF00' },
              };
            }
          }
        } else if (specificColumn === 7) {
          if (
            (rowData?.value === 'H' || (rowData?.value === 'H' && rowData?.day === 'Sun')) &&
            rowData?.value !== 'Sh'
          ) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: '00a300' },
            };
          } else if (rowData?.value === 'L') {
            cell.font = {
              name: 'Times New Roman',
            };
          } else if (rowData?.value === 'A') {
            cell.font = {
              color: { argb: 'FF0000' },
              name: 'Times New Roman',
            };
          }

          if (rowData?.date_leave?.[0]?.status_request === 'afternoon') {
            cell.font = {
              color: { argb: 'FF0000' },
              name: 'Times New Roman',
            };
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFF00' },
            };
          }
        } else if (specificColumn === 8) {
          if (
            (rowData?.value === 'H' || (rowData?.value === 'H' && rowData?.day === 'Sun')) &&
            rowData?.value !== 'Sh'
          ) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: '00a300' },
            };
          } else if (
            rowData?.value === 'A' ||
            rowData?.value === 'UL' ||
            rowData?.value === 'AL' ||
            rowData?.value === 'Missed Scan' ||
            (rowData?.value === 'AL1/2' && rowData?.day !== 'Sun')
          ) {
            cell.font = {
              name: 'Times New Roman',
            };
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF0000' },
            };
          }
        } else if (specificColumn === 9) {
          const isKhmer = /[\u1780-\u17FF]/.test(rowData?.note);
          if (
            rowData?.value === 'H' ||
            (rowData?.day === 'Sun' && department !== 'LCL - SALE FOLLOWER') ||
            (rowData?.day === 'Sat' && rowData?.value === 'Sh')
          ) {
            cell.font = {
              color: {
                argb:
                  rowData?.day === 'Sun' &&
                  (rowData?.time_check_out === null ||
                    rowData?.time_check_out === '' ||
                    rowData?.time_check_out === undefined ||
                    rowData?.time_check_in === null ||
                    rowData?.time_check_in === '' ||
                    rowData?.time_check_in === undefined)
                    ? 'FF0000'
                    : 'FF0000',
              },
              name: isKhmer ? 'Kh Battambang' : 'Times New Roman',
            };
          }
        }
      };

      applyConditionalFormatting(6);
      applyConditionalFormatting(7);
      applyConditionalFormatting(8);
      applyConditionalFormatting(9);
    });

    worksheet.pageSetup = {
      paperSize: 9,
      orientation: 'portrait',
      fitToPage: true,
      fitToHeight: 1,
      fitToWidth: 1,
      margins: {
        left: 0.25,
        right: 0.25,
        top: 0.75,
        bottom: 0.75,
        header: 0.3,
        footer: 0.3,
      },
    };

    const paddingTopBottom = 5;
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 2) {
        const contentHeight = row.height || 10;
        row.height = contentHeight + paddingTopBottom * 2;
      }
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}(${form_name_date?.name}).xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    });

    return;
  }

  // =========================================================
  // OLD SINGLE EXPORT (KEEP SAME CONCEPT)
  // =========================================================

  // Add the data starting from row 3
  worksheet.addRows(data);
  worksheet.mergeCells('A1:I1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = `FINGER PRINT ${form_name_date?.date_name}`;
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'AACC92' },
  };
  titleCell.font = {
    name: 'Times New Roman',
    size: 11,
    bold: true,
  };

  worksheet.getRow(1).height = 22;

  data?.forEach((row, rowIndex) => {
    headers2?.forEach((header, colIndex) => {
      const cell = worksheet.getCell(rowIndex + 3, colIndex + 1);
      cell.value = row[header.key];
      const isKhmer = /[\u1780-\u17FF]/.test(row[header?.key]);
      if (header?.key === 'name') {
        cell.font = {
          color: { argb: '000000' },
          name: 'Kh Battambang',
          size: 11,
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else {
        cell.font = {
          color: { argb: '000000' },
          name: isKhmer ? 'Kh Battambang' : 'Times New Roman',
          size: 11,
        };
      }

      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
  });

  const startRow1 = data.length + 3;

  const setTotalCell = (cell, label) => {
    cell.value = `${label}`;
    cell.alignment = { horizontal: 'left' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'F6CAAE' },
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    cell.font = { name: 'Times New Roman', size: 11 };
  };

  const setTotalValueCell = (cell, value) => {
    cell.value = value;
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'F6CAAE' },
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    cell.font = { name: 'Times New Roman', size: 11 };
  };

  setTotalCell(worksheet.getCell(`G${startRow1 + 1}`), 'Absent', '');
  setTotalCell(worksheet.getCell(`I${startRow1 + 1}`), 'days', '');
  setTotalValueCell(
    worksheet.getCell(`H${startRow1 + 1}`),
    total_count_report !== undefined ? total_count_report?.count_a : 0 || 0
  );
  setTotalCell(worksheet.getCell(`G${startRow1 + 2}`), 'Annual Leave', '');
  setTotalCell(worksheet.getCell(`I${startRow1 + 2}`), 'days', '');
  setTotalValueCell(
    worksheet.getCell(`H${startRow1 + 2}`),
    total_count_report !== undefined ? total_count_report?.count_al : 0 || 0
  );

  setTotalCell(worksheet.getCell(`G${startRow1 + 3}`), 'Unpaid Leave', '');
  setTotalCell(worksheet.getCell(`I${startRow1 + 3}`), 'days', '');
  setTotalValueCell(worksheet.getCell(`H${startRow1 + 3}`), total_count_report?.count_ul || 0);
  setTotalCell(worksheet.getCell(`G${startRow1 + 4}`), 'Missed Scan', '');
  setTotalCell(worksheet.getCell(`I${startRow1 + 4}`), 'times', '');
  setTotalValueCell(
    worksheet.getCell(`H${startRow1 + 4}`),
    total_count_report !== undefined ? total_count_report?.count_ms : 0 || 0
  );

  setTotalCell(worksheet.getCell(`G${startRow1 + 5}`), 'Late', '');
  setTotalCell(worksheet.getCell(`I${startRow1 + 5}`), 'times', '');
  setTotalValueCell(
    worksheet.getCell(`H${startRow1 + 5}`),
    total_count_report !== undefined ? total_count_report?.count_l : 0 || 0
  );

  const checkIfMerged = (worksheet, range) => {
    const mergedCells = worksheet._mergedCells || [];
    return mergedCells.some((cellRange) => {
      const [start, end] = cellRange.split(':');
      return range.includes(start) || range.includes(end);
    });
  };

  const unmergeCells = (worksheet, range) => {
    const mergedCells = worksheet._mergedCells || [];
    const updatedMergedCells = mergedCells.filter((cellRange) => !rangeIncludes(cellRange, range));
    worksheet._mergedCells = updatedMergedCells;
  };

  const rangeIncludes = (existingRange, targetRange) => {
    const [start1, end1] = existingRange.split(':');
    const [start2, end2] = targetRange.split(':');
    return start2 >= start1 && end2 <= end1;
  };

  const safeMergeCells = (worksheet, range) => {
    if (!checkIfMerged(worksheet, range)) {
      worksheet.mergeCells(range);
    }
  };

  const setKhmerSign = (cell, value) => {
    cell.value = value;
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {};
    cell.font = { name: 'Kh Battambang', size: 11 };
  };

  unmergeCells(worksheet, `B${startRow1 + 2}:C${startRow1 + 3}`);
  safeMergeCells(worksheet, `B${startRow1 + 1}:C${startRow1 + 1}`);
  safeMergeCells(worksheet, `B${startRow1 + 2}:C${startRow1 + 3}`);

  setKhmerSign(worksheet.getCell(`B${startRow1 + 2}`));

  setKhmerSign(worksheet.getCell(`B${startRow1 + 1}`), 'ផ្នែករដ្ផបាលនិងធនធានមនុស្ស');
  setKhmerSign(
    worksheet.getCell(`B${startRow1 + 2}`),
    'ឈ្មោះ..........................................................'
  );

  worksheet.columns =
    Array.isArray(headers2) &&
    headers2?.map((header) => ({
      width: header.width || 10,
    }));

  worksheet.addTable({
    name: 'MyTable',
    ref: 'A2',
    headerRow: true,
    totalsRow: false,
    columns: headers2?.map((header) => ({
      name: header.header,
      filterButton: false,
      height: '10px',
    })),
    rows: data.map((row) => headers2?.map((header) => row[header.key])),
  });

  const headerRow = worksheet.getRow(2);
  headerRow.height = 20;

  const startRow = 2;
  const endRow = startRow + data.length;
  const startColumn = 1;
  const endColumn = headers2?.length;

  for (let col = startColumn; col <= endColumn; col++) {
    const cell = worksheet.getCell(startRow, col);
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'AACC92' },
    };

    cell.font = { bold: true, name: 'Times New Roman' };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  }

  for (let row = startRow; row <= endRow; row++) {
    for (let col = startColumn; col <= endColumn; col++) {
      const cell = worksheet.getCell(row, col);

      cell.border = {
        top: { style: 'thin', color: { argb: 'FFFFFF' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } },
      };
    }
  }

  const specificColumn = headers2?.length;

  for (let rowIndex = 3; rowIndex < data.length + 3; rowIndex++) {
    const rowData = data[rowIndex - 3];

    for (let columnIndex = 1; columnIndex <= specificColumn; columnIndex++) {
      const cell = worksheet.getCell(rowIndex, columnIndex);
      const cell6 = worksheet.getCell(rowIndex, 6);
      const cell7 = worksheet.getCell(rowIndex, 7);
      const cell8 = worksheet.getCell(rowIndex, 8);
      const cell9 = worksheet.getCell(rowIndex, 9);
      // console.log(rowData?.day)

      if (rowData?.day === 'Sun') {
        if (
          rowData?.time_check_in ||
          rowData?.time_check_out ||
          department !== 'FCL - SALE (China Warehouse)' ||
          rowData?.value === 'H'
        ) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '' },
          };
        }
      }

      if (rowData?.day === 'Sun' && rowData?.value !== 'H' && !rowData?.time_check_in && !rowData?.time_check_out) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF00' },
        };
      }

      if (rowData?.time_check_in === undefined || rowData?.time_check_in === '' || rowData?.time_check_in === null) {
        cell6.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF00' },
        };
      }

      if (rowData?.time_check_out === undefined || rowData?.time_check_out === '' || rowData?.time_check_out === null) {
        cell7.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF00' },
        };
      }

      if (rowData?.value === 'Sh') {
        cell8.value = '';
      }

      if (rowData?.value === 'Sh' && rowData?.day !== 'Sun' && rowData?.day !== 'Sat') {
        cell9.value = '';
      }
      const text9 = String(rowData?.note ?? cell9.value ?? '');
      const isKhmer9 = /[\u1780-\u17FF]/.test(text9);

      cell9.font = {
        color: { argb: 'FFFF0000' },
        name: isKhmer9 ? 'Kh Battambang' : 'Times New Roman',
        size: isKhmer9 ? 11 : 11,
      };
    }
  }

  const applyConditionalFormatting = (specificColumn) => {
    for (let rowIndex = 3; rowIndex < data.length + 3; rowIndex++) {
      const cell = worksheet.getCell(rowIndex, specificColumn);
      const rowData = data[rowIndex - 3];
      if (specificColumn === 6) {
        if ((rowData?.value === 'H' || (rowData?.value === 'H' && rowData?.day === 'Sun')) && rowData?.value !== 'Sh') {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '00a300' },
          };
        } else if (rowData?.value === 'Late In') {
          cell.font = {
            color: { argb: 'FF0000' },
            name: 'Times New Roman',
          };

          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF00' },
          };
        } else if (rowData?.value === 'AL1/2') {
          if (rowData?.date_leave?.[0]?.status_request === 'morning') {
            cell.font = {
              color: { argb: 'FF0000' },
              name: 'Times New Roman',
            };

            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFF00' },
            };
          }
        }
      } else if (specificColumn === 7) {
        if ((rowData?.value === 'H' || (rowData?.value === 'H' && rowData?.day === 'Sun')) && rowData?.value !== 'Sh') {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '00a300' },
          };
        } else if (rowData?.value === 'L') {
          cell.font = {
            name: 'Times New Roman',
          };
        } else if (rowData?.value === 'A') {
          cell.font = {
            color: { argb: 'FF0000' },
            name: 'Times New Roman',
          };
        }

        if (rowData?.date_leave?.[0]?.status_request === 'afternoon') {
          cell.font = {
            color: { argb: 'FF0000' },
            name: 'Times New Roman',
          };

          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF00' },
          };
        }
      } else if (specificColumn === 8) {
        if ((rowData?.value === 'H' || (rowData?.value === 'H' && rowData?.day === 'Sun')) && rowData?.value !== 'Sh') {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '00a300' },
          };
        } else if (
          rowData?.value === 'A' ||
          rowData?.value === 'UL' ||
          rowData?.value === 'AL' ||
          (rowData?.value === 'AL1/2' && rowData?.day !== 'Sun')
        ) {
          cell.font = {
            name: 'Times New Roman',
          };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF0000' },
          };
        }
      } else if (specificColumn === 9) {
        const isKhmer = /[\u1780-\u17FF]/.test(rowData?.note);
        if (
          rowData?.value === 'H' ||
          (rowData?.day === 'Sun' && department !== 'LCL - SALE FOLLOWER') ||
          (rowData?.day === 'Sat' && rowData?.value === 'Sh')
        ) {
          cell.font = {
            color: {
              argb:
                rowData?.day === 'Sun' &&
                (rowData?.time_check_out === null ||
                  rowData?.time_check_out === '' ||
                  rowData?.time_check_out === undefined ||
                  rowData?.time_check_in === null ||
                  rowData?.time_check_in === '' ||
                  rowData?.time_check_in === undefined)
                  ? 'FF0000'
                  : 'FF0000',
            },
            name: isKhmer ? 'Kh Battambang' : 'Times New Roman',
          };
        }
      }
    }
  };

  applyConditionalFormatting(6);
  applyConditionalFormatting(7);
  applyConditionalFormatting(8);
  applyConditionalFormatting(9);

  worksheet.pageSetup = {
    paperSize: 9,
    orientation: 'portrait',
    fitToPage: true,
    fitToHeight: 1,
    fitToWidth: 1,
    margins: {
      left: 0.25,
      right: 0.25,
      top: 0.75,
      bottom: 0.75,
      header: 0.3,
      footer: 0.3,
    },
  };

  const paddingTopBottom = 5;

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1 && rowNumber > 2) {
      const contentHeight = row.height || 10;
      row.height = contentHeight + paddingTopBottom * 2;
    }
  });

  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}(${form_name_date?.name}).xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  });
};

export default ExportExcelFile;
