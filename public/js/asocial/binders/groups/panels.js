asocial.binders.add('groups', { panels: function() {

  /* CONFIGURATION */

  // Variables
  var groupBy      = 4,         // How many groups are shown on each row
      panel_margin = [15, 15],  // The top and bottom margin that surrounds a panel
      panel_height = 200;       // The height of a panel

  // Animation styles
  var styles = {
    openedContainerStyle: {
      opacity: 1,
      height: panel_height + panel_margin[0] + panel_margin[1]
    },

    openedPanelStyle: {
      opacity: 1,
      height: panel_height,
      marginTop: panel_margin[0],
      marginBottom: panel_margin[1]
    },

    closedContainerStyle: {
      opacity: 0,
      height: 0
    },

    closedPanelStyle: {
      opacity: 0,
      height: 0,
      marginTop: 0,
      marginBottom: 0
    }
  };

  /* DOM EDITING */

  // Scale group sizes
  $('.group').css({ width: 100 / groupBy + '%' });

  // Group rows into .group-row divs
  $(".group").wrapSlices( groupBy, '<div class="group-row" />');

  // Group group-panels into .group-panel-container divs
  $(".group-panel").wrapSlices( groupBy, '<div class="group-panel-container" />');

  // Accordingly set data-row and data-column
  $('.group-row, .group-panel-container').each(function(i){
    // Give the same index for a .group-row and its .group-panel-container
    $(this).attr('data-row', Math.floor(i / 2));

    // Give sequential indexes inside of them
    $(this).find('.group, .group-panel').each(function(i){
      $(this).attr('data-column', i);
    });
  });

  // Style color scheme according to dominant and median colors
  $('.group-panel').each(function(){

    // Get the palette
    var palette = $(this).data('palette');

    // Color shortcuts
    var colors = { dominant: palette[0], median: { first:  palette[1], second: palette[2] } };

    // Get indexes of current element
    var row     = $(this).parent().data('row'),
        column  = $(this).data('column');

    // Create CSS selectors
    var panelSelector = '#groups-container .group-panel-container[data-row="' + row + '"] .group-panel[data-column="' + column + '"]',
        groupSelector = '#groups-container .group-row[data-row="' + row + '"] .group[data-column="' + column + '"]';

    // Style elements
    jss(panelSelector).add({
      'background-color': colors.dominant,
      //'border-color': transparencize(colors.median.first, 0.5),
      'box-shadow': 'inset 0px 4px 6px -5px ' + colors.median.first
    });
    jss(panelSelector + ' h3').add({
      'color': colors.median.first
    });
    jss(panelSelector + ' p').add({
      'color': colors.median.second
    });
    jss(groupSelector + '::before').add({
      'border-bottom-color': colors.dominant
    });
    jss(groupSelector + '::after').add({
      'border-bottom-color': colors.median.first
    });

  });

  /* EVENTS */

  // Bind panel toggling to groups
  $('#main').on('click', '.group > a', function(){ console.log()

    // Get indexes
    var column_i = $(this).closest('.group').data('column'),
        row_i    = $(this).closest('.group-row').data('row');

    // Get elements
    var group                 = $(this).closest('.group');
        group_panel_container = $('.group-panel-container[data-row="' + row_i + '"]'),
        group_panel           = group_panel_container.find('.group-panel[data-column="' + column_i + '"]');

    // Close every other .group-panel-container
    $('.group-panel-container').not('[data-row="' + row_i + '"]')
      .css(styles.closedContainerStyle)
      .data('opened', false);

    // Close every .group-panel
    $('.group-panel').css(styles.closedPanelStyle);

    // Remove active style (and arrow) from every .group
    $('.group').removeClass('paneled');

    // Calculate group's relative position
    var group_offset = group.position().top;

    // Scroll to group
    $("html, body").animate({ scrollTop: group_offset - 5 }, 200);

    // Open .group-panel-container and panel simultenaously
    group_panel_container
      .transition(styles.openedContainerStyle, 500, 'snap');

    // Animate or display panel whether or not its container was already opened
    group_panel_container.data('opened') ?
      group_panel.css(styles.openedPanelStyle) :
      group_panel.transition(styles.openedPanelStyle, 500, 'snap') ;

    // Add arrow
    group.addClass('paneled');

    // Mark .group-panel-container as opened
    group_panel_container.data('opened', true);

  });

} }); // asocial.binders.add();