
from pyPdf import PdfFileWriter, PdfFileReader


def rearrange_pdf():

    output_pdf = PdfFileWriter()

    input_pdf_path = '/Users/maxfowler/Desktop/publish-whats-on-your-mind/whats-on-your-mind-nov11-no-linebreaks-chrono.pdf'
    # input_pdf_path = '/Users/maxfowler/Desktop/publish-whats-on-your-mind/whats-on-your-mind-nov11-no-linebreaks-chrono-pagenumbers.pdf'
    output_pdf_path = '/Users/maxfowler/Desktop/publish-whats-on-your-mind/to-print.pdf'

    with open(input_pdf_path, 'rb') as readfile:
        input_pdf = PdfFileReader(readfile)
        num_total_pages = input_pdf.getNumPages()
        one_third_of_length = num_total_pages / 3
        first_third = range(0, one_third_of_length)
        second_third = range(one_third_of_length, 2*one_third_of_length)
        third_third = range(2*one_third_of_length, num_total_pages)

        # assertions
        first_set = set(first_third)
        second_set = set(second_third)
        third_set = set(third_third)
        all_pages = set(range(0, num_total_pages))
        assert not first_set.intersection(second_set)
        assert not first_set.intersection(third_set)
        assert not second_set.intersection(third_set)
        assert first_set.union(second_set).union(third_set) == all_pages

        for x in range(0, one_third_of_length):
            top_index = first_third[x]
            middle_index = second_third[x]
            top_part = input_pdf.getPage(top_index)
            middle_part = input_pdf.getPage(middle_index)
            output_pdf.addPage(top_part)
            output_pdf.addPage(middle_part)
            if x < len(third_third):
                bottom_index = third_third[x]
                bottom_part = input_pdf.getPage(bottom_index)
                output_pdf.addPage(bottom_part)
            else:
                print '++ leaving blank for bottom part'
        with open(output_pdf_path, "wb") as writefile:
            output_pdf.write(writefile)


if __name__ == '__main__':
    rearrange_pdf()