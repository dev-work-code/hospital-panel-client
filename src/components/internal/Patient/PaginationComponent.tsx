import * as React from "react";
import {
    Pagination,
    PaginationContent,
    PaginationLink,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
} from "@/components/ui/pagination"; // Adjust import paths as necessary

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const PaginationComponent: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    setCurrentPage,
}) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <Pagination className="mt-4">
            <PaginationContent className="flex flex-col lg:flex-row w-full justify-between items-center">
                {/* Left-aligned Previous button */}
                <PaginationItem className="flex-1 flex justify-start">
                    <PaginationPrevious
                        onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                    />
                </PaginationItem>

                {/* Center-aligned page numbers */}
                <PaginationItem className="flex-1 flex justify-center space-x-2">
                    {pageNumbers.map((page) => (
                        <PaginationLink
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            isActive={page === currentPage}
                            className={page === currentPage ? "bg-[#E9F4FF] border-none" : ""}
                        >
                            {page}
                        </PaginationLink>
                    ))}
                </PaginationItem>

                {/* Right-aligned Next button */}
                <PaginationItem className="flex-1 flex justify-end">
                    <PaginationNext
                        onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default PaginationComponent;
