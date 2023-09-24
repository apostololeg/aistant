function SvgIcon({ icon: Icon, size = 20 }) {
  const style = {
    height: size,
    width: size,
    minHeight: size,
    minWidth: size,
  };

  return <Icon style={style} />;
}

export default SvgIcon;
