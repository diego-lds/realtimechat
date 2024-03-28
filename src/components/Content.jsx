const Content = props => {
    const { children, ...rest } = props;
    console.log(children, rest);
    return <div {...rest}>{children}</div>;
};

export default Content;
