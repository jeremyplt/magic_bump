function NavigationBar() {
  return (
    <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}></Tabs>
  );
}

export default NavigationBar;
