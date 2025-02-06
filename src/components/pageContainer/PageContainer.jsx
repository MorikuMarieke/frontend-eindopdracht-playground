import './PageContainer.css'
export default function PageContainer({
                                          className,
                                          children
                                      }) {

    return (
        <div className={`page-container ${className || ''}`}>
            {children}
        </div>
    );
};