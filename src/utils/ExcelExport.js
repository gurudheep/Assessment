import * as XLSX from 'xlsx';

export const exportToExcel = (data, filename) => {
  try {
    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    
    // Save file
    XLSX.writeFile(wb, `${filename}.xlsx`);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    alert('Failed to export data. Please try again.');
  }
};