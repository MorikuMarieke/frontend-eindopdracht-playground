export default function CardContainer({
                                   className,
                                   children
                               }) {

    return (
        <section className={className}>
            {children}
        </section>
    );
};